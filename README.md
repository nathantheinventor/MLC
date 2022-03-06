# MLC
MLC (MIDI Lighting Control) is a desktop application to control lighting systems using DMX from a MIDI command.

## Background
My church (Suber Road Baptist Church in Greer, SC) uses Faithlife Proclaim to control our song and sermon slides, and we have a lighting system that is controlled over DMX using an Enttec USB Pro Mk2 adapter. I have tried several lighting control programs, and I have also researched many hardware solutions, and none of them meet the basic needs we have:
* Control the lights over DMX
* Be easy to use and set up
* Allow external control over MIDI (from Proclaim)
* Allow duplicate MIDI requests without canceling previous actions (i.e. if we send MIDI scene 2 twice, it should stay on scene 2, not turn off the second time).

The best existing option I have found so far is QLC+. It is very confusing for most of the techs on my team (and even for me), but it does the basics acceptably. However, it turns off scenes on duplicate requests (i.e. a scene is a toggle that turns off if it's already on), and that doesn't work well for our needs. Because QLC+ does not adequately meet our needs (and I haven't found any other software that does meet our needs), I have decided to create MLC to address our needs.

## Features
MLC is built entirely around **scenes**. A **scene** is the state of all of the faders at a given time. For example, a scene could include channel 1 at level 127, channel 2 at level 200, etc. DMX allows up to 512 channels, each with a level in the range 0-255, and MLC will show only the channels that you set up as belonging to actual devices.

MLC allows you to define scenes, recall different scenes, and recall scenes on demand over MIDI using hardware or software such as Faithlife Proclaim.

## Technology
MLC is built on the following technologies:
* Electron: packages a JavaScript applciation as a native desktop app
* React: frontend framework for the user interface
* node-midi: Node.js library for interacting with MIDI devices / applications
* serial-port: Node.js library for interacting with serial ports
  - [Enttec DMX Pro Mk2](https://www.enttec.com/product/controls/dmx-usb-interfaces/dmx-usb-pro-interface/): USB interface to MIDI
  - [DmxPy](https://github.com/itsb/DmxPy) - example in Python that shows how to control the DMX adapter using a serial port
