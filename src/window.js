/* window.js
 *
 * Copyright 2021 Ryannnkl
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const { Gio, GLib, GObject, Gtk } = imports.gi;

var StopwatchWindow = GObject.registerClass({
    GTypeName: 'StopwatchWindow',
    Template: 'resource:///org/rendapp/Stopwatch/window.ui',
    InternalChildren: [
      'hours_adjustment',
      'minutes_adjustment',
      'seconds_adjustment',
      'hours_spinbutton',
      'minutes_spinbutton',
      'seconds_spinbutton',
      'stack',
      'start_button',
      'pause_button',
      'stop_button'
    ]
}, class StopwatchWindow extends Gtk.ApplicationWindow {
    _init(application) {
        super._init({ application });

        this._application = application;

        this._start_button.connect('clicked',this._startButtonClicked.bind(this));
        this._stop_button.connect('clicked',this._stopButtonClicked.bind(this));
        this._pause_button.connect('clicked',this._pauseButtonClicked.bind(this));
    }

    _startButtonClicked() {
      this._stack.visible_child_name = 'pause_stop';
      this._stopTimer = false;
      this._pauseTimer = false;

      this._hours_spinbutton.sensitive = false;
      this._minutes_spinbutton.sensitive = false;
      this._seconds_spinbutton.sensitive = false;

      let seconds = this._hours_adjustment.value * 60 * 60 +
        this._minutes_adjustment.value * 60 +
        this._seconds_adjustment.value;

      let timer = GLib.timeout_add_seconds(GLib.PPRIORITY_DEFAULT,1,() => {
        // pause timer
        if(this._pauseTimer)
          return GLib.SOURCE_CONTINUE;

        if(this._stopTimer) {
          this._stopTimer = false;
          return GLib.SOURCE_REMOVE;
        }

        seconds--;

        this._hours_adjustment.value = Math.floor(seconds / 60 /60);
        this._minutes_adjustment.value = (Math.floor(seconds / 60)) % 60 ;
        this._seconds_adjustment.value = seconds % 60;

        if(seconds > 0) {
          return GLib.SOURCE_CONTINUE;
        }
        this._notify();
        this._stop();

        return GLib.SOURCE_REMOVE;
      })
    }

    _stopButtonClicked() {
      this._stopTimer = true;
      this._stop();
    }

    _pauseButtonClicked() {
      this._pauseTimer = !this._pauseTimer;

      if(this._pauseTimer) {
        this._pause_button.label = "Continuar";
        this._pause_button.get_style_context().add_class("suggested-action");
      } else {
        this._pause_button.label = "Pausar";
        this._pause_button.get_style_context().remove_class("suggested-action");
      }
    }

    _stop() {

      this._stack.visible_child_name = 'start';
      this._hours_spinbutton.sensitive = true;
      this._minutes_spinbutton.sensitive = true;
      this._seconds_spinbutton.sensitive = true;

      this._hours_adjustment.value = 0;
      this._minutes_adjustment.value = 0;
      this._seconds_adjustment.value = 0;
    }

    _notify() {
      const notification = new Gio.Notification();
      notification.set_title("Contador finalizado");
      notification.set_body("o contador chegou ao zero");

      this._application.send_notification(
        "org.rendapp.StopWatch.Over",
        notification
      );
    }
});

