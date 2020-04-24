# Project Artemis Backend Setup

## Setting up Virtual Environment

To setup a brand new local virtual environment for installing your dependencies in your preferred directory, run

    $ virtualenv venv

To activate the virtual environment, run

    $ source venv/bin/activate

To deactive the virtual environment,

    $ deactivate

## Installing Dependencies

After activating your virtual environment, install server dependencies using

    $ cd server/
    $ pip3 install -r requirements.txt

## Running the Server

To run the Flask server,

    $ python3 app.py
