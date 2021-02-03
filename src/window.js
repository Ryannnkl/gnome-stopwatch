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

const { GObject, Gtk } = imports.gi;

var StopwatchWindow = GObject.registerClass({
    GTypeName: 'StopwatchWindow',
    Template: 'resource:///org/rendapp/Stopwatch/window.ui',
    InternalChildren: [
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

        this._start_button.connect('clicked',this._startButtonClicked.bind(this));
        this._stop_button.connect('clicked',this._stopButtonClicked.bind(this));
        this._pause_button.connect('clicked',this._pauseButtonClicked.bind(this));
    }

    _startButtonClicked() {
      log("Clicked");
      // this._stack.transition_type = "GTK_STACK_TRANSITION_TYPE_SLIDE_UP";
      this._stack.visible_child_name = 'pause_stop';
    }

    _stopButtonClicked() {
      this._stack.visible_child_name = 'start';
    }

    _pauseButtonClicked() {

    }
});

