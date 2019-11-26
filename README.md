# <img src="./client/src/assets/iceberg3.png" height="50px" /> Icebreaker

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

The front-end is built with [React](https://reactjs.org/) and connects to a [Flask](https://flask.palletsprojects.com/en/1.1.x/) (Python-based) back-end hosted on [Heroku](https://www.heroku.com/). Data is stored in a [Firebase](https://firebase.google.com/) real-time database, specifically [Firestore](https://firebase.google.com/docs/firestore). The real-time connection is maintained via [Socket.IO](https://socket.io/).

## Try it out!

Go to http://deep-dive-072193.herokuapp.com/, and join room `AAAAAA`! This will take you through the entire flow of the application as a user. If you're hosting an event yourself, try creating a room and sharing its code with your guests!

Unfortunately, it's not possible to run the app locally without a connection to a live Firebase database; the server will not function properly without it. The necessary keys/credentials are provided via a hidden, non-committed file `server/keys.json` for local runtimes and provided as environment variables in the production instance on Heroku. However, assuming all of the credentials exist, a normal development flow looks like:

```
pipenv shell    # Activate python virtual environment and install pip dependencies
./dev.sh        # Start backend Flask server
```

In a separate terminal window:

```
cd client       # Jump to frontend/client code directory
npm install     # Install npm dependencies for frontend
npm start       # Start frontend server for local React bundle
```

If changes are made to the frontend code and they are ready for release, build the React production bundle (script below). However, make sure to commit it to the git repository afterwards, too, so that Heroku actually picks up the changes. This process can be automated in the future as simply a step in the CI/CD pipeline.

```
npm run build   # Updates 'client/build' directory with production React bundle
```

## Project Structure

```
.
├── client/                  # React Application (frontend)
│   ├── README.md
│   ├── package.json         # Node/npm app configuration
│   ├── public/              # Basic webapp configuration files, for local runs
│   ├── build/               # Production bundle home; built using public/ and src/
│   └── src/
│        ├── assets/         # Project images, videos, etc.
│        ├── containers/     # Top level "smart" components for app's pages
│        ├── lib/            # Shared data, configuration, and utilities
│        ├── styles          # High-level css styles for normalization
│        ├── App.js          # Main app component/container
│        └── index.js        # Top-level entrypoint for React
│
├── server/                  # Flask Application (backend)
│   ├── main.py              # Entrypoint for server
│   ├── env.py               # Environment setup
│   ├── configs.py           # Environment dependent configuration setup
│   ├── firebase.py          # Firebase setup for Firestore DB
│   └── match.py             # Utilities for calculating user matching
│
├── dev.sh                   # Local server startup code
├── prod.sh                  # Production server startup code
├── runtime.txt              # Python configuration
├── Pipfile                  # Pip dependencies for server
├── Procfile                 # Heroku startup configuration file
└── README.md
```

## Credits

Initial version of [the React front-end code](https://github.com/acesetmatch/Icebreaker) was sourced from [a Facebook Chicago Hackathon project](https://devpost.com/software/icebreaker-vi5yo8) I built with my team, of the same name.
