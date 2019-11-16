def determine_matches(user_id, room_data):
    users = room_data["users"]
    user_question_rankings = users.get(
        user_id, {}).get("userQuestionRankings", {})
    matches = room_data["matches"]

    for other_user_id in users:
        if other_user_id == user_id:
            continue

        match_id = (
            f"{other_user_id}{user_id}"
            if other_user_id < user_id
            else f"{user_id}{other_user_id}"
        )

        other_user_data = users[other_user_id]
        other_user_question_rankings = other_user_data.get(
            "userQuestionRankings", {}
        )

        common_answered_questions = [
            question_id
            for question_id in user_question_rankings.keys()
            if question_id in other_user_question_rankings.keys()
        ]
        common_liked_questions = []

        match_accumulator = 0.0
        for question_id in common_answered_questions:
            current_user_answer = user_question_rankings[question_id]
            other_user_answer = other_user_question_rankings[question_id]

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
