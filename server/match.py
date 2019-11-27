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
    user_question_rankings = users.get(
        user_id, {}).get("userQuestionRankings", {})
    matches = room_data["matches"]

    for other_user_id in users:
        # User skips over themself
        if other_user_id == user_id:
            continue

        # The match id is the concatenation of the two users' ids and stays
        # consistent by ensuring the keys are ordered lexicographically
        match_id = (
            f"{other_user_id}{user_id}"
            if other_user_id < user_id
            else f"{user_id}{other_user_id}"
        )

        other_user_data = users[other_user_id]
        other_user_question_rankings = other_user_data.get(
            "userQuestionRankings", {}
        )

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
        match_accumulator = 0.0
        for question_id in common_answered_questions:
            current_user_answer = user_question_rankings[question_id]
            other_user_answer = other_user_question_rankings[question_id]

            # Consider refactoring into a separate function
            if current_user_answer == "dislike":
                if other_user_answer == "dislike":
                    match_accumulator += 1.0
                elif other_user_answer == "indifferent":
                    match_accumulator += 0.5
                elif other_user_answer == "like":
                    match_accumulator += 0.0
                elif other_user_answer == "superlike":
                    match_accumulator += -0.5
            elif current_user_answer == "indifferent":
                if other_user_answer == "dislike":
                    match_accumulator += 0.5
                elif other_user_answer == "indifferent":
                    match_accumulator += 1.0
                elif other_user_answer == "like":
                    match_accumulator += 0.5
                elif other_user_answer == "superlike":
                    match_accumulator += 0.0
            elif current_user_answer == "like":
                if other_user_answer == "dislike":
                    match_accumulator += 0.0
                elif other_user_answer == "indifferent":
                    match_accumulator += 0.5
                elif other_user_answer == "like":
                    common_liked_questions.append(question_id)
                    match_accumulator += 1.0
                elif other_user_answer == "superlike":
                    common_liked_questions.append(question_id)
                    match_accumulator += 1.5
            elif current_user_answer == "superlike":
                if other_user_answer == "dislike":
                    match_accumulator += -0.5
                elif other_user_answer == "indifferent":
                    match_accumulator += 0.0
                elif other_user_answer == "like":
                    common_liked_questions.append(question_id)
                    match_accumulator += 1.5
                elif other_user_answer == "superlike":
                    common_liked_questions.append(question_id)
                    match_accumulator += 2.0

        # "Match percentage" is an interpolation of the match strength
        # from 0 to 1 based on the lowest possible match strength it could be
        # and the highest possible match strength it could be
        match_percentage = 0
        if common_answered_questions:
            min_score = len(common_answered_questions) * -0.5
            max_score = len(common_answered_questions) * 2.0
            match_percentage = (match_accumulator -
                                min_score) / (max_score - min_score)
        match_data = {
            "matchStrength": match_accumulator,
            "matchPercentage": match_percentage,
            "commonQuestions": common_liked_questions,
        }
        matches[match_id] = match_data

    return matches
