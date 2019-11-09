<img src="./client/src/assets/iceberg3.png" height="300px" width="auto" />

# Icebreaker

## Inspiration

Meet Jonah. An introverted, moderately quiet person between the ages of 18 - 35 years old. Jonah has a lot of interests and has had many unique experiences that make him a fascinating person to talk to. However, he doesn't often get the chance to truly share his interests, likes, and personality in social settings. When he finds those one or two people who he can deeply connect with at a party, his night is made! But finding those people means anxiety and stress. Sometimes, it doesn't seem worth it, so he avoids going places altogether.

Whether it’s your first day of school, a work conference, or your friend’s house party, there’s no shortage of ways to improve the experience of fostering connections. Icebreakers can be effective, but they’re often in large groups, which can be impersonal and overwhelming. Too much time and anxiety is spent on finding the right people to talk to and the right topic to talk about. A digital medium could facilitate these in-real-life encounters to great effect.

Introducing, Icebreaker™ - the easy way to break the ice and make better connections. Inspired by the wonderful multiplayer experiences of [Jackbox Games](https://jackboxgames.com/) and [Spyfall](https://spyfall.crabhat.com/), Icebreaker fosters deeper IRL connections between people, based around the topics they'd like to talk about and the questions they’d love to delve into together.

## How does it work?

Let's say you're planning a low-key party at your house. Not everyone will know each other there, so you turn to Icebreaker™ to ease the anxiety of people getting to know each other. You come to the website, and create a shared event "room." Icebreaker autogenerates a unique 6-character room code for you. As guests start trickling into your home, you share the room code with them.

Now let's switch our perspective to you as a guest. You get to the party, and the host shares the room code with you. You come to the site, enter the code (along with some identifying information), and then get whisked into the core of the digital experience.

First, you see a "Tinder" like experience, except instead of swiping on people, you're swiping on **questions** and **topics**. In other words, would you want to answer these questions or talk about these topics with someone else in a 1:1 conversation? If yes, swipe right! If no, swipe left! Really love it? Swipe up for a super like!

Once you're finished swiping, you enter the "digital room." You'll see a list of all the people at the party, ordered by how closely they match with you over your preferred questions and topics of conversation! Moreover, this list updates in real time, meaning that as new people join the party, you might find an even better top-ranked match later into the night. You can click into a person's profile from the list, and see specifically what you two can bond over.

What happens next is up to you! You choose who to talk to and what to talk to about. Happy friendshipping!

## Technologies Used

The front-end will be built with [React](https://reactjs.org/) and will connect to a [Flask](https://flask.palletsprojects.com/en/1.1.x/) (Python-based) back-end. Data will be a stored in a [Firebase](https://firebase.google.com/) real-time database, specifically [Firestore](https://firebase.google.com/docs/firestore). The real-time connection will be maintained via [Socket.IO](https://socket.io/).

## Credits

Initial version of [the React front-end code](https://github.com/acesetmatch/Icebreaker) was sourced from [a Facebook Chicago Hackathon project](https://devpost.com/software/icebreaker-vi5yo8) I built with my team, of the same name.
