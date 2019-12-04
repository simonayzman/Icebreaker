"""Backend test suite, primarily for matching logic"""

from sys import path
from pytest import approx
from json import load

from match import \
    is_question_ranking_positive, is_question_compatible, score_question_compatibility, \
    NEGATIVE_COMPATIBILITY_WEAK_2, NEGATIVE_COMPATIBILITY_WEAK_1, \
    NEUTRAL_COMPATIBILITY, INVALID_COMPATIBILITY, \
    POSITIVE_COMPATIBILITY_WEAK_1, POSITIVE_COMPATIBILITY_WEAK_2, \
    POSITIVE_COMPATIBILITY_STRONG_1, POSITIVE_COMPATIBILITY_STRONG_2

# Loads sample room json file
with open(f"{path[0]}/room.json") as f:
    ROOM = load(f)
    print(ROOM)


def test_question_ranking_positive():
    assert is_question_ranking_positive("superlike") is True
    assert is_question_ranking_positive("like") is True
    assert is_question_ranking_positive("indifferent") is False
    assert is_question_ranking_positive("dislike") is False
    assert is_question_ranking_positive("random") is False


def test_question_ranking_compatible():
    assert is_question_compatible("superlike", "superlike") is True
    assert is_question_compatible("superlike", "like") is True
    assert is_question_compatible("superlike", "indifferent") is False
    assert is_question_compatible("superlike", "dislike") is False
    assert is_question_compatible("superlike", "random") is False

    assert is_question_compatible("like", "superlike") is True
    assert is_question_compatible("like", "like") is True
    assert is_question_compatible("like", "indifferent") is False
    assert is_question_compatible("like", "dislike") is False
    assert is_question_compatible("like", "random") is False

    assert is_question_compatible("indifferent", "superlike") is False
    assert is_question_compatible("indifferent", "like") is False
    assert is_question_compatible("indifferent", "indifferent") is False
    assert is_question_compatible("indifferent", "dislike") is False
    assert is_question_compatible("indifferent", "random") is False

    assert is_question_compatible("dislike", "superlike") is False
    assert is_question_compatible("dislike", "like") is False
    assert is_question_compatible("dislike", "indifferent") is False
    assert is_question_compatible("dislike", "dislike") is False
    assert is_question_compatible("dislike", "random") is False

    assert is_question_compatible("random", "superlike") is False
    assert is_question_compatible("random", "like") is False
    assert is_question_compatible("random", "indifferent") is False
    assert is_question_compatible("random", "dislike") is False
    assert is_question_compatible("random", "random") is False


def test_scoring_question_compatibility():
    assert score_question_compatibility(
        "superlike", "superlike") == approx(POSITIVE_COMPATIBILITY_STRONG_2)
    assert score_question_compatibility(
        "superlike", "like") == approx(POSITIVE_COMPATIBILITY_STRONG_1)
    assert score_question_compatibility("superlike", "indifferent") == approx(NEUTRAL_COMPATIBILITY)
    assert score_question_compatibility(
        "superlike", "dislike") == approx(NEGATIVE_COMPATIBILITY_WEAK_1)
    assert score_question_compatibility("superlike", "random") == approx(INVALID_COMPATIBILITY)

    assert score_question_compatibility(
        "like", "superlike") == approx(POSITIVE_COMPATIBILITY_STRONG_1)
    assert score_question_compatibility("like", "like") == approx(POSITIVE_COMPATIBILITY_WEAK_2)
    assert score_question_compatibility(
        "like", "indifferent") == approx(POSITIVE_COMPATIBILITY_WEAK_1)
    assert score_question_compatibility("like", "dislike") == approx(NEUTRAL_COMPATIBILITY)
    assert score_question_compatibility("like", "random") == approx(INVALID_COMPATIBILITY)

    assert score_question_compatibility("indifferent", "superlike") == approx(NEUTRAL_COMPATIBILITY)
    assert score_question_compatibility(
        "indifferent", "like") == approx(POSITIVE_COMPATIBILITY_WEAK_1)
    assert score_question_compatibility(
        "indifferent", "indifferent") == approx(POSITIVE_COMPATIBILITY_WEAK_2)
    assert score_question_compatibility(
        "indifferent", "dislike") == approx(POSITIVE_COMPATIBILITY_WEAK_1)
    assert score_question_compatibility("indifferent", "random") == approx(INVALID_COMPATIBILITY)

    assert score_question_compatibility(
        "dislike", "superlike") == approx(NEGATIVE_COMPATIBILITY_WEAK_1)
    assert score_question_compatibility("dislike", "like") == approx(NEUTRAL_COMPATIBILITY)
    assert score_question_compatibility(
        "dislike", "indifferent") == approx(POSITIVE_COMPATIBILITY_WEAK_1)
    assert score_question_compatibility(
        "dislike", "dislike") == approx(POSITIVE_COMPATIBILITY_WEAK_2)
    assert score_question_compatibility("dislike", "random") == approx(INVALID_COMPATIBILITY)

    assert score_question_compatibility("random", "superlike") == approx(INVALID_COMPATIBILITY)
    assert score_question_compatibility("random", "like") == approx(INVALID_COMPATIBILITY)
    assert score_question_compatibility("random", "indifferent") == approx(INVALID_COMPATIBILITY)
    assert score_question_compatibility("random", "dislike") == approx(INVALID_COMPATIBILITY)
    assert score_question_compatibility("random", "random") == approx(INVALID_COMPATIBILITY)
