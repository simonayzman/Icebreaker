"""Environment dependent configuration setup"""

from os import environ

configs = {
    "development": {
        "client": {
            "token": "((( DEV ENV )))",
            "api": "http://localhost",
            "port": 8000,
        },
        "server": {"static": "../client/build", "template": "../client/build"},
    },
    "production": {
        "client": {
            "token": "((( PROD ENV )))",
            "api": "https://deep-dive-072193.herokuapp.com",
            # "port": environ.get("PORT"),
        },
        "server": {
            "static": "../client/build/static",
            "template": "../client/build",
        },
    },
}


def get_config(platform="server"):
    """
    Provides configuration values based on the environment and the requested platform

    Args:
        platform (str): Accepts "server" or "client" representing the platforms supported

    Returns:
        dict: Object representing relevant configuration data
    """
    return configs[environ.get("FLASK_ENV")][platform]
