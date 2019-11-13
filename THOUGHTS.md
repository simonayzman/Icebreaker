```
App flow

U comes to site and see prompt to create new room AND enter room code
C requests all questions that exist
C determines if user has come before (uuid exists in local storage)
if uuid doesnt exist
    C creates uuid and save to local storage
    C creates user on S?
    S adds entry to firebase
else
    C requests user's questions ranking from S

C filters questions based on all questions and user's question rankings

if U has answered all questions
    C shows U extra prompt to retake test
else if U has answered some questions
    C offers U to answer some more questions
    C shows U extra prompt to retake test? (only questions already answered?)
else if U has answered no questions
    C offers U to answer questions

U does questions ranker
C sends questions rankings to S

U enters room code
C saves last used room into local storage



User refreshes page

---------------------------

Database design

Users
    user_id:
        user_id
        question_rankings:
            super_likes: [question_id]
            likes:
            indifferent:
            dislikes:

            OR

            question_id1: superlike
            question_id2: like
            ...

Questions
    question_id:
        prompt: ""
        depth?
        topics?

Rooms:
    room_id:
        all_users: [all user_ids ever joined]
        current_users: [constantly updating users room]
        matches: (order room_users ^ 2 entries; normalize matches into separate document?)
            user_id1-user_id2:
                common_questions: [likes + super_likes]
                match_strength: SEE ALGORITHM

What happens when user creates a room?
    Rooms document gets new entry, with single entry all_users/current_users matches starts off empty

What happens when user joins a room?
    Room's all users increases (if never been before), and current users added automatically
    All relevant matches are added or updated

What happens when user leaves a room?
    Only current users updates
    If current users is empty, delete room? Could be tricky

What happens when user updates question rankings?
    User document changes (Users/user_id/question_rankings)
    All relevant matches are added or updated

How are matches added/updated?
    For each user in all users
        skip if current user
        otherwise build entry key (user_id1-user_id2 sorted lexically)
        build common_liked_questions (user1.super_likes + user1.likes).intersection(user2.super_likes + user2.likes)
        match strength determined by answers to all questions
    room gets sent message (new matches subdoc)
```
