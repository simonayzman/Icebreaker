import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Button, Text, ListItem, Icon } from 'react-native-elements';
import Swiper from 'react-native-deck-swiper';

import SAMPLE_QUESTIONS from '../constants/questions';
import SAMPLE_MATCHES from '../constants/matches';
import SAMPLE_USERS from '../constants/users';
import { add_user, add_room } from '../Firestore';

export default class CardSwipeScreen extends Component {
    constructor(props) {
        super(props);
        this.questionList = props.navigation.state.params.questionList;
        this.state = {
            questionRankings: {},
            inProgressQuestionRankings: {},
            allUsers: Object.keys(SAMPLE_USERS),
            currentUsers: Object.keys(SAMPLE_USERS).splice(2),
            users: SAMPLE_USERS,
            matches: SAMPLE_MATCHES,
            finishedQuestions: false,
            numOfQuestionsLeft: Object.keys(this.questionList).length,
            questions: this.questionList
        };
    }

    componentDidMount() {
        console.log("Nav params is: " + JSON.stringify(this.props.navigation.state.params))
    }

    onSwipe = (cardIndex, ranking) => {
        const { inProgressQuestionRankings } = this.state;
        const orderedQuestions = Object.values(this.questionList)
        const numOfQuestions = orderedQuestions.length;
        const numOfQuestionsLeft = numOfQuestions - 1 - cardIndex;
        this.setState({
            inProgressQuestionRankings: {
                ...inProgressQuestionRankings,
                questionId: ranking,
            },
            numOfQuestionsLeft: numOfQuestionsLeft,
            // questions: questions
        });
    };

    onSwipedAll = () => {
        const { inProgressQuestionRankings } = this.state;
        this.setState({
            questionRankings: inProgressQuestionRankings,
            inProgressQuestionRankings: {},
            finishedQuestions: true
        });
    };

    renderCard = questionId => {
        const { questions } = this.state;
        const question = questions[questionId];
        return (
            <View style={styles.card}>
                <Text style={styles.text}>{question.prompt}</Text>
            </View>
        );
    };

    enterRoomScreen = async () => {
        const { userId, codeName, roomId, description, roomState, roomName } = this.props.navigation.state.params;

        console.log('!!!!', userId, roomId, codeName, description);

        if (roomState != "join") {
            await add_room(roomId, roomName);
        }
        await add_user(roomId, {
            userId,
            codeName,
            description,
            questionRankings: this.state.questionRankings
        });

        this.props.navigation.replace("Room", {
            userId,
            roomId,
            codeName
        })
    }

    render() {
        const { questions } = this.state;

        console.log(questions)
        let orderedQuestions = Object.keys(questions)
        const numOfQuestions = orderedQuestions.length;


        return (
            <SafeAreaView style={styles.container}>
                {
                    this.state.numOfQuestionsLeft > 0
                    &&
                    <View style={{ alignItems: "center" }}>
                        <Text>Number of Questions Left</Text>
                        <Text>{`${this.state.numOfQuestionsLeft} / ${numOfQuestions}`}</Text>
                    </View>
                }
                <View style={{ flex: 1 }} >
                    {
                        this.state.finishedQuestions ?
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                <Text>You're done with all your questions</Text>
                                <TouchableOpacity style={styles.joinButton} onPress={this.enterRoomScreen}>
                                    <Text style={{ color: "#fff" }}>Join Room</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <Swiper
                                cardIndex={0}
                                stackSize={3}
                                useViewOverflow={false}
                                verticalSwipe={false}
                                cards={orderedQuestions}
                                renderCard={this.renderCard}
                                onSwipedLeft={cardIndex => this.onSwipe(cardIndex, 'dislike')}
                                onSwipedRight={cardIndex => this.onSwipe(cardIndex, 'like')}
                                onSwipedAll={this.onSwipedAll}
                                cardHorizontalMargin={0}
                                backgroundColor={'#F5FCFF'}
                            />
                    }
                </View>
            </SafeAreaView >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        padding: 10
    },
    card: {
        flex: 1,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 30,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#E8E8E8',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'white',
        padding: 20,
    },
    text: {
        textAlign: 'left',
        fontSize: 32,
        backgroundColor: 'transparent',
    },
    joinButton: {
        marginTop: 25,
        alignSelf: "stretch",
        marginLeft: 25,
        marginRight: 25,
        height: 50,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "blue"
    },
});
