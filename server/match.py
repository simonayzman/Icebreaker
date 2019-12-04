# Constants for question rankings compatibility values
NEGATIVE_COMPATIBILITY_WEAK_2 = -1.0
NEGATIVE_COMPATIBILITY_WEAK_1 = -0.5
NEUTRAL_COMPATIBILITY = 0.0
POSITIVE_COMPATIBILITY_WEAK_1 = 0.5
POSITIVE_COMPATIBILITY_WEAK_2 = 1.0
POSITIVE_COMPATIBILITY_STRONG_1 = 1.5
POSITIVE_COMPATIBILITY_STRONG_2 = 2.0

INVALID_COMPATIBILITY = 0.0

# Determines heuristic bounds for min/max compatibility
MIN_COMPATIBILITY_VALUE = NEGATIVE_COMPATIBILITY_WEAK_1
MAX_COMPATIBILITY_VALUE = POSITIVE_COMPATIBILITY_STRONG_2


def score_question_compatibility(user1_question_ranking, user2_question_ranking):
    """
    Determines how strong the compatibility of two users' rankings of a question is.

    Args:
        user1_question_ranking (str): The way user1 ranked the question.
        user2_question_ranking (str): The way user2 ranked the question.

    Returns:
        number: A numerical value describing the match strength of the question.
    """
    if user1_question_ranking == "dislike":
        if user2_question_ranking == "dislike":
            return POSITIVE_COMPATIBILITY_WEAK_2
        elif user2_question_ranking == "indifferent":
            return POSITIVE_COMPATIBILITY_WEAK_1
        elif user2_question_ranking == "like":
            return NEUTRAL_COMPATIBILITY
        elif user2_question_ranking == "superlike":
            return NEGATIVE_COMPATIBILITY_WEAK_1
    elif user1_question_ranking == "indifferent":
        if user2_question_ranking == "dislike":
            return POSITIVE_COMPATIBILITY_WEAK_1
        elif user2_question_ranking == "indifferent":
            return POSITIVE_COMPATIBILITY_WEAK_2
        elif user2_question_ranking == "like":
            return POSITIVE_COMPATIBILITY_WEAK_1
        elif user2_question_ranking == "superlike":
            return NEUTRAL_COMPATIBILITY
    elif user1_question_ranking == "like":
        if user2_question_ranking == "dislike":
            return NEUTRAL_COMPATIBILITY
        elif user2_question_ranking == "indifferent":
            return POSITIVE_COMPATIBILITY_WEAK_1
        elif user2_question_ranking == "like":
            return POSITIVE_COMPATIBILITY_WEAK_2
        elif user2_question_ranking == "superlike":
            return POSITIVE_COMPATIBILITY_STRONG_1
    elif user1_question_ranking == "superlike":
        if user2_question_ranking == "dislike":
            return NEGATIVE_COMPATIBILITY_WEAK_1
        elif user2_question_ranking == "indifferent":
            return NEUTRAL_COMPATIBILITY
        elif user2_question_ranking == "like":
            return POSITIVE_COMPATIBILITY_STRONG_1
        elif user2_question_ranking == "superlike":
            return POSITIVE_COMPATIBILITY_STRONG_2

    return INVALID_COMPATIBILITY


def is_question_ranking_positive(question_ranking):
    """
    Determines if a user's ranking of a question is considered "positive"
    Currently, this only pertains to "like" and "superlike"

    Args:
        question_ranking (str): The way a question was ranked.

    Returns:
        bool: True if the ranking is positive.
    """
    return question_ranking == "like" or question_ranking == "superlike"


def is_question_compatible(user1_question_ranking, user2_question_ranking):
    """
    Determines if two users' rankings of a question are both positive

    Args:
        user1_question_ranking (str): The way user1 ranked the question.
        user2_question_ranking (str): The way user2 ranked the question.

    Returns:
        bool: True if both users positively ranked the quesiton.
    """
    user1_likes = is_question_ranking_positive(user1_question_ranking)
    user2_likes = is_question_ranking_positive(user2_question_ranking)
    return user1_likes and user2_likes


def determine_matches(user_id, room_data):
    """
    Given a user and the current room data (containing the current matches), this function provides what the
    update matches should be. The only matches that should be added or that should change are those
    between the provided user and every other user. The matches between other users should remain unaffected.

    Note: If we imagine the users as being nodes within a fully connected graph, the "matches" are the edges describing
    the relationship between any two users, i.e., what questions/topics the two users liked and their match strength.

    Args:
        user_id (str): The user's unique id.
        room_data (dict): All the data describing the current room.
            meta (dict): Information about the room
                roomCode (str): The 6-letter room identifying code.
                roomName (str): The user-defined room name.
            users (dict): All of the users currently in the room
                {userId} (dict): Key is the user id.
                    userId (str): The user's unique id.
                    userName (str): The user's provided name.
                    userDescription (str): The user's description of themself.
                    userQuestionRankings (dict): The user's rankings of the questions/topics.
            matches (dict):
                {userId1+userId2} (dict): Key is the (sorted) concatenation of two users' ids.
                    commonQuestions (str): An array representing the questions both users liked.
                    matchPercentage (num): A percentage representing the match between the two users.
                    matchStrength (num): A raw score representing the match between the two users.

    Returns:
        dict: All the matches between all the users, but updated with the new user
            {userId1+userId2} (dict): Key is the (sorted) concatenation of two users' ids.
                commonQuestions (str): An array representing the questions both users liked.
                matchPercentage (num): A percentage representing the match between the two users.
                matchStrength (num): A raw score representing the match between the two users.
    """
    users = room_data["users"]
    user_question_rankings = users.get(user_id, {}).get("userQuestionRankings", {})
    matches = room_data["matches"]

    for other_user_id in users:
        # User skips over themself
        if other_user_id == user_id:
            continue

        # The match id is the concatenation of the two users' ids and stays
        # consistent by ensuring the keys are ordered lexicographically
        match_id = f"{other_user_id}{user_id}" if other_user_id < user_id else f"{user_id}{other_user_id}"

        other_user_data = users[other_user_id]
        other_user_question_rankings = other_user_data.get("userQuestionRankings", {})

        # Determines the question commonalities between the two users
        common_answered_questions = [
            question_id
            for question_id in user_question_rankings.keys()
            if question_id in other_user_question_rankings.keys()
        ]
        common_liked_questions = []

        # For each commonly answered question,
        # we determine how much "match strength" is added
        # This logic should definitely be simplified in the future
        match_strength = 0.0
        for question_id in common_answered_questions:
            current_user_answer = user_question_rankings[question_id]
            other_user_answer = other_user_question_rankings[question_id]
            match_strength += score_question_compatibility(current_user_answer, other_user_answer)
            if is_question_compatible(current_user_answer, other_user_answer):
                common_liked_questions.append(question_id)

        # "Match percentage" is an interpolation of the match strength
        # from 0 to 1 based on the lowest possible match strength it could be
        # and the highest possible match strength it could be
        match_percentage = 0
        if common_answered_questions:
            min_score = len(common_answered_questions) * MIN_COMPATIBILITY_VALUE
            max_score = len(common_answered_questions) * MAX_COMPATIBILITY_VALUE
            match_percentage = (match_strength - min_score) / (max_score - min_score)

        match_data = {
            "matchStrength": match_strength,
            "matchPercentage": match_percentage,
            "commonQuestions": common_liked_questions,
        }
        matches[match_id] = match_data

    return matches
