
const COLS = 83;
const ROWS = 22;
const SCROLL_AMT_TO_MOVE = 30;

function resize () {
  const wrapper = document.getElementById("wrapper");
  const scale = Math.min(
    window.innerWidth / 1920,
    window.innerHeight / 1080,
  );
  wrapper.style.transform = `translate(-50%, -50%) scale(${scale})`;
}


function navPopulate(nav) {
  var curHeight = 0;
  while (nav.list.firstChild) {
    nav.list.removeChild(nav.list.firstChild);
  }
  for (var i = nav.top; curHeight < nav.height; i++) {
    if (i == nav.chapters.length) {
      break;
    }
    const li = document.createElement("li");
    li.setAttribute("tabindex", "0");
    li.setAttribute("index", i);
    if (i == nav.active) {
      li.classList.add("selected");
    }
    const chapter = nav.chapters[i];
      console.log(`curHeight + chapter.tHeight: ${curHeight + chapter.tHeight} `);
      console.log("nav.height: " + nav.height);
    if (!(curHeight + chapter.tHeight >= nav.height)) {
      li.classList.add("full-margin");
    }
    if (curHeight + chapter.tHeight >= nav.height + 1) {
      break;
    }
    li.innerText = chapter.title;
    nav.list.append(li);
    curHeight += chapter.tHeight + 1;
  } - 1
}

  function HandleScroll (e, elCont, callback) {
    elCont.scrollBuf += e.deltaY;
    if (elCont.scrollBuf > SCROLL_AMT_TO_MOVE) {
      callback(1);
      elCont.scrollBuf = 0;
    }
    if (elCont.scrollBuf < - SCROLL_AMT_TO_MOVE) {
      callback(-1);
      elCont.scrollBuf = 0;
    }
  }


const Nav = {
  element: document.getElementById("nav"),
  list: document.getElementById("list"),
  height: 24,
  scrollBuf: 0,
  top: 0,
  active: 0,
  chapters: [
    { title: "01 Introduction", tHeight: 1, id : 0},
    { title: "chapter 2 \n line 2", tHeight: 2 },
    { title: "chapter 3", tHeight: 1 },
    { title: "chapter 4", tHeight: 1 },
    { title: "chapter 5", tHeight: 1 },
    { title: "chapter 6", tHeight: 1 },
    { title: "chapter 7", tHeight: 1 },
    { title: "chapter 8", tHeight: 1 },
    { title: "chapter 9", tHeight: 1 },
    { title: "chapter 10", tHeight: 1 },
    { title: "chapter 11", tHeight: 1 },
    { title: "chapter 12", tHeight: 1 },
    { title: "chapter 13 \n line 2", tHeight: 2 },
    { title: "chapter 14", tHeight: 1 },
    { title: "chapter 15", tHeight: 1 },
    { title: "chapter 16", tHeight: 1 },
    { title: "chapter 17", tHeight: 1 },
  ]
};

const content = {
  0: "hello this is html"
};

function navMakeActive (chapterIndex) {
  if (0 <= chapterIndex && chapterIndex <= Nav.chapters.length - 1) {
    Nav.active = chapterIndex;
    if (Nav.active < Nav.top + 1) {
      Nav.top--;
      if (Nav.top < 0) {
        Nav.top = 0;
      }
    }
    const bottomIndex = Nav.top + Nav.list.childNodes.length - 1;
    if (Nav.active > bottomIndex - 1) {
      if (bottomIndex < Nav.chapters.length - 1) {
        Nav.top++;
      }
    }
    navPopulate(Nav);
    Nav.list.querySelectorAll("li").forEach(function (li) {
      if (parseInt(li.getAttribute("index")) == Nav.active) {
        li.classList.add("selected");
      }
      else {
        li.classList.remove("selected");
      }
    });
    const article = document.getElementById("article");
    article.innerHTML = content[Nav.chapters[Nav.active]["id"]];
  }
}

Nav.list.addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    navMakeActive(parseInt(e.target.getAttribute("index")));
  }
})

const navButtons = document.getElementById("nav-bottom-buttons");

navButtons.addEventListener("click", function (e) {
  if (e.target.id == "nav-down") {
    navMakeActive(Nav.active + 1);
  }
  if (e.target.id == "nav-up") {
    navMakeActive(Nav.active - 1);
  }
})

function navPositionActive() {
  if (Nav.active < Nav.top + 1) {
    Nav.top == Nav.top + 1
  }
}

function navScroll (amount) {
  const bottomIndex = Nav.top + Nav.list.childNodes.length - 1;
  if (amount == -1 && Nav.top != 0 || amount == 1 && bottomIndex < Nav.chapters.length - 1) {
    Nav.top += amount;
    navPopulate(Nav);
  }
}

function navHandleScroll(e) {
  HandleScroll(e, Nav, navScroll);
}

navPopulate(Nav);

window.addEventListener('resize', resize);
resize();

Nav.element.addEventListener("wheel", navHandleScroll);
