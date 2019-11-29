"""Backend test suite, primarily for matching logic"""

from pytest import approx
from match import determine_matches

room = {
    "meta": {"roomCode": 'AAAAAA', "roomName": 'Test Room'},
    "users": {},
    "matches": {},
}


def test_match_basic():
    assert len(room["matches"]) == 1
