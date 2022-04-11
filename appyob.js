const title = document.querySelector('input[name=title]'); //инпут заголовка
const content = document.querySelector('input[name=content]'); //инпут поста
const postContainer = document.querySelector('.postContainer'); //общий контейнер куда будем добавлять посты
document.querySelector('button').addEventListener('click', createPost);

function createPost() { //очень тупой способ который каждый шаг делает вручную
    if (checkInput()) {
    const newSection = document.createElement("section"); //создаем новую секцию под пост
    newSection.classList.toggle('post');

    const newH = document.createElement("h1"); //создаем новый тайтл
    newH.classList.toggle('postTitle');
    newH.innerText = title.value.trim().replace("<", "&lt;").replace(">", "&gt;"); //очень базовый санитайзер хрени которую можно написать в инпут. Хотя вроде и без неё тэги не считываются?

    const date = new Date().toLocaleString(); //создаем новое время
    const newDate = document.createElement("p");
    newDate.classList.toggle('postDate');
    newDate.innerText = date;

    const newP = document.createElement("p");  //создаем новый пост
    newP.classList.toggle('postText');
    newP.innerText = content.value.trim().replace("<", "&lt;").replace(">", "&gt;"); //очень базовый санитайзер хрени которую можно написать в инпут. Хотя вроде и без неё тэги не считываются?

    title.value = "";
    content.value = ""; //обнуляем поля

    // postContainer.insertAdjacentElement("beforeend", newSection); //собираем всё вместе в конец ленты. Эта хрень работает
    // newSection.insertAdjacentElement("beforeend", newH);
    // newSection.insertAdjacentElement("beforeend", newDate);
    // newSection.insertAdjacentElement("beforeend", newP);

    postContainer.appendChild(newSection); //собираем всё вместе в конец ленты. Эта хрень тоже работает
    newSection.appendChild(newH);
    newSection.appendChild(newDate);
    newSection.appendChild(newP);
    }
};

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
};

//     if (_.inRange(title.value.trim().length, 1, 96) && _.inRange(content.value.trim().length, 1, 250)) { //"быстрый" способ проверки без отдельных кейсов ошибки.
//         return true;
//     } else {
//         alert('ошибка');
//     }
// };
