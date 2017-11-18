import firebase from '../../fire';
const database = firebase.database();

export const incrementScoreBy = (num, gameId, user) => {
  database.ref('users/' + user + '/totalScore').transaction(score => score += num);
  database.ref('games/' + gameId + '/playersInGame/' + user + '/score').transaction((score) => {
    score += 1;
    if (score >= 10) {
      database.ref('games/' + gameId + '/playersInGame/').update({ 'winner': user });
      score = 0;
    }
    return score;
  });
};
