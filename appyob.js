const defaultUser = {  //этот юзер должен храниться на сервере и ауторизироваться через логин/пароль. На данный момент не могу такое сделать, поэтому он просто сохранён объектом по аналогии данных с сервака 
    id:	101,
    name:	"Test User",
    username:	"Tuser",
    email:	"test@er.us",
    address:{
        street:	"Test",
        suite:	"Apt. 112",
        city:	"Testborough",
        zipcode:	"92998-3874",
        geo:{
            lat:	"-34.3159", 
            lng:	"82.1496"}},
    phone: "1-555-555-5555 x56442",
    website: "testing.org",
    company:{	
        name:	"test inc.",
        catchPhrase:	"catchphrase!",
        bs:	"test"}
};
const title = document.querySelector('input[name=title]'); //инпут заголовка
const content = document.querySelector('input[name=content]'); //инпут поста
const postContainer = document.querySelector('.postContainer'); //общий контейнер куда будем добавлять посты
document.querySelector('.submitButton').addEventListener('click', submitPost); //добавляем пост с инпута юзера на сервер и на сайт
document.querySelector('.loadJSON').addEventListener('click', loadPost); //загружаем рандомный  пост с сервера
document.addEventListener("DOMContentLoaded", showPosts); //загружаем и отображаем все посты при загрузке страницы

async function getUserAccs() {  //загрузка листа юзеров
    const response = await fetch(`https://jsonplaceholder.typicode.com/users`);
    const userData = await response.json();
    return userData;
}

async function getPosts() {  //загрузка листа постов
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/`);
    const postData = await response.json();
    return postData;
}

function showPosts() {                                   //загрузка и отображение постов через .then; Ждём посты + аккаунты через promise.all
    Promise.all([getPosts(), getUserAccs()])
    .then(values => {
        const [posts, users] = values;
        posts.forEach(obj => {
            title.value = obj.title;
            content.value = obj.body;
            let feId = obj.userId;
            createPost(users.find(obj => obj.id === feId).username); //отображаем загруженные посты, передавая в функцию юзернейм автора. При этом заголовок и текст поста сохраняются в инпуты напрямую сейчас и забираются оттуда createPost-ом. 
        }                                                            //По хорошему нужно сохранять это в отдельные переменные, нет смысла отображать это в html, но влом переписывать
    )})
    .finally(clear => {
        title.value = '';
        content.value = ''; //очищаем последние заполненные подгрузкой поля за собой, чтобы туда можно было вручную что-то забить
    })
}

async function submitPost() {    //пытаемся передать пост серверу. Если успех, добавляем на страницу. 
    try {
        const upload = await fetch(`https://jsonplaceholder.typicode.com/posts/`,{
            method: 'POST',
            body: JSON.stringify({userId: defaultUser.id, id: 101, title: `${title.value}`, body: `${content.value}`}),
        })
        if (upload.ok) {
            createPost(defaultUser.username)
        } else {
            throw new Error ('Failed to upload') //в случае провала ожидаю ошибку, не тестил 
        }}
    catch (error) {
        console.log(error.message);
    }
}

function createPost(username) { //более модный способ создания постов через вставку HTML. 
    if (checkInput()) {
        const date = new Date().toLocaleString(); //создаем новое время
        const post = `<section class="post">
        <h1 class="postTitle">${title.value.trim().replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</h1>
        <div class="dateIDContainer">
        <p class="postDate">${date}</p>
        <p class="username">by: ${username}</p>
        </div>
        <p class="postText">${content.value.trim().replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</p>
        </section>`;  //создаём наш пост с небольшим санитайзом (замена кавычек html-тэгов на энтети)
        postContainer.insertAdjacentHTML("afterbegin", post);
    }
}

function checkInput() { //проверка на ошибки с выводом сообщений путём конкатенации строки 
    let err = '';
    if (title.value.trim().length < 1) {
        err += 'Заголовок поста не может быть менее 1 символа.\n';
    }
    if (title.value.trim().length > 96) {
        err += 'Заголовок поста не может быть длиннее 96 символов.\n';
    }
    if (content.value.trim().length < 1) {
        err += 'Текст поста не может быть менее 1 символа.'
    }
    if (content.value.trim().length > 250) {
        err += 'Текст поста не может быть длиннее 250 символов.'
    }
    if (err.length === 0) { //это вообще законно или нет?
        return true
    } else {
        alert(err);
    }
}

function loadPost() {                                   //загрузка рандомного поста на страницу. 
    Promise.all([getPosts(), getUserAccs()])
    .then(values => {
        const [posts, users] = values;
        let i = randomIntFromInterval(1,100);
        title.value = posts[i].title;
        content.value = posts[i].body;
        let feId = posts[i].userId;
        createPost(users.find(obj => obj.id === feId).username); //отображаем пост из общего массива, передавая в функцию юзернейм автора. При этом заголовок и текст поста сохраняются в инпуты напрямую сейчас и забираются оттуда createPost-ом. 
        }                                                        //По хорошему нужно запрашивать с сервера 1 рандомный пост через `https://jsonplaceholder.typicode.com/posts/${randomIntFromInterval(1, 100)}`, но это нужно делать отдельную функцию запроса, влом
    )
    .finally(clear => {
        title.value = '';
        content.value = ''; //очищаем последние заполненные подгрузкой поля за собой, чтобы туда можно было вручную что-то забить
    })
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

