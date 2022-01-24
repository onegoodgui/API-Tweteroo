import express from "express";
import cors from 'cors';

const server = express();
server.use(cors());
server.use(express.json());


const users = [];
const tweets = [];

server.post('/sign-up', (req, res) => {
    console.log('sign-up enviado!')
    const user = req.body;

    let urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
    let url = user.avatar;
    let urlValidation = urlRegex.test(url);
    console.log(urlValidation);

    if(user.username === '' || user.username === null){
        res.sendStatus('400');
        res.send('Todos os campos são obrigatórios!')
        return
    }
    if(urlValidation === false){
        res.sendStatus('400');
        res.send('Todos os campos são obrigatórios!')
        return
    }

    users.push(user);
    res.send('Ok');
    res.status('200');

})

server.post('/tweets', (req, res)=>{


    const headers = req.headers;
    const username = headers.user;
    const msg = req.body;

    const userPost = users.find((usr) => usr.username === username);
    const tweet = {...userPost, ...msg}
    if(msg.tweet == '' || msg.tweet === null || msg.username === '' || msg.username === null){
        res.sendStatus('400');
        res.send('Todos os campos são obrigatórios!')
        return
    }

    tweets.push(tweet);
    res.status('201');
    res.send(tweets);

})


server.get('/tweets/', (req, res)=>{


    console.log('entrou em /tweets GET')
    let queryId = req.query.page;
    console.log(queryId);


    if(queryId >= 2){
        const morelist = tweets.filter((tweet, index) => {
            if(index < tweets.length - 10*(queryId-1) && index >= tweets.length - 10*queryId){
                return true
            }
        })

        if(morelist === null || morelist === undefined){
            res.send([]);
            return
        }
       
        res.send(morelist);
        return
        
    }

    const list = tweets.filter((tweet, index) => {
        if(index >= tweets.length - 10*queryId ){
            return true
        }
    })
    console.log(list);
    res.send(list);
})


server.get('/tweets/:username', (req, res)=>{

  const username = req.params.username;
  const list = tweets.filter((tweet) => {
      if(tweet.username === username){
          return true
      }
  })

  res.send(list);
})

server.listen(5000);