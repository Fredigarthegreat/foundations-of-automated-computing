
const COLS = 81;
const ROWS = 25;
const SCROLL_AMT_TO_MOVE = 30;

function resize () {
  const wrapper = document.getElementById("wrapper");
  const scale = Math.min(
    window.innerWidth / 1920,
    window.innerHeight / 1080,
  );
  wrapper.style.transform = `translate(-50%, -50%) scale(${scale})`;
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

function navPopulate(navState) {
  var curHeight = 0;
  while (navState.list.firstChild) {
    navState.list.removeChild(navState.list.firstChild);
  }
  for (var i = navState.top; curHeight < navState.height; i++) {
    if (i == navState.chapters.length) {
      break;
    }
    const li = document.createElement("li");
    li.setAttribute("tabindex", "0");
    li.setAttribute("index", i);
    if (i == navState.selectedChapter) {
      li.classList.add("selected");
    }
    const chapter = navState.chapters[i];
    if (!(curHeight + chapter.tHeight >= navState.height)) {
      li.classList.add("full-margin");
    }
    if (curHeight + chapter.tHeight >= navState.height + 1) {
      break;
    }
    li.innerText = chapter.title;
    navState.list.append(li);
    curHeight += chapter.tHeight + 1;
  } - 1
}

function getActiveChapterLength (navState, material) {
  const chapter = material[navState.chapters[navState.selectedChapter]["id"]];
  if (chapter) {
    return chapter.length;
  } else {
    return 0;
  }
}

function navSelectPage (navState, material, pageIndex) {
  console.log(material[0].length);
  const chapterLength = getActiveChapterLength(navState, material);
  if (0 <= pageIndex && pageIndex <= chapterLength - 1) {
    navState.selectedPage = pageIndex;
    navDrawPageControl(navState, material);
  }
}

function articleOveride (navState, material, chapterID, pageIndex) {
  const article = document.getElementById("article");
  article.innerHTML = getChapterContent(navState, material, chapterID, pageIndex);
}

function getChapterContent(navState, material, chapterID, pageIndex) {
  return material[chapterID][pageIndex];

}


function navDrawPageControl (navState, material) {
  const chapterLength = getActiveChapterLength(navState, material);
  var pageControlString = "";
  for (var i = 0; i <= chapterLength - 1; i++) {
    if (i == navState.selectedPage) {
      pageControlString += "*";
    } else {
      pageControlString += "-";
    }
  }
  navState.pageControl.innerText = pageControlString;
  const article = document.getElementById("article");
  if (chapterLength) {
    article.innerHTML = 
      getChapterContent(
        navState, 
        material, 
        navState.chapters[navState.selectedChapter]["id"],
        navState.selectedPage
      );
  } else {
    article.innerHTML = "";
  }
}

const Nav = {
  element: document.getElementById("nav"),
  list: document.getElementById("list"),
  pageControl: document.getElementById("page-control"),
  height: 24,
  scrollBuf: 0,
  top: 0,
  selectedChapter: 0,
  selectedPage: 0,
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

const courseMaterial = {
  "help": [
`            HELP

         h: previous page
         l: next page
    j or n: next chapter
    k or p: previous chapter
            
            Press ESC to exit help.`
  ],
  0: [
`Hello! Thank you so much for visiting my website!

I am so fired up to help you get started on your journey towards computer science
mastery! It's a tricky field to get into, so I am very pleased you are trusting 
my ability to help you find your way there. 

This course is designed for complete beginners, but if you've already started
programming, ESPECIALLY if you've found yourself discouraged or jaded after 
your past incursions, this is definitely the right course for you. Even if 
you are a seasoned amateur, I 100% guarantee that you will come away with a 
new perspective, and you will likely learn something you didn't know before!

If you're eager to get going, you can feel free to skip to the next chapter. 
Or don't! Up to you...

(Press the right arrow-key or l to go to the next page. Press ? for help)`,
`Computers are an integral part of our everyday lives at the time of writing (the 
year 2025). Everyone loves the improved quality of life that they offer. But most 
people, even programmers, view computers as hopelessly complicated and aren't 
encouraged to learn much about how they really work. So why should you as someone 
interested in computer programming pay attention to how computers really work at
a deep level?

1. Computers are dope.

This is my favorite reason! It is so wild to me that we have figured out how to 
outsource our brain-work to components made from raw materials. I don't know 
about you, but I get a unique exhilaration from gaining the ability to wrap my 
mind around a complicated system that has the potential to be really useful. It's 
especially rewarding when you find hidden tricks and thinking tools to understand 
parts of it that other people have missed! I have a deep love for digital 
computing that goes beyond providing value to computer users and I'm so excited 
to share it with you! I already know that we're going to have a blast together! 

(Press the left arrow-key or j if you want to go back to a previous page)`,
`2. Bolster your employment chances.

If you need income right away it might be wise to fast track your entry into the 
industry by skipping right to web programming. But the dependability of this 
choice is fading away quickly. It is getting harder and harder even for computer 
science graduates to find employment, let alone junior developers fresh out of 
web-dev boot camp. At the time of writing, the industry is in a widespread hiring 
slump. You'll need to set yourself apart if you want a chance at getting hired. 

3. Initiate a pattern for motivated growth.

Does it seem impossible that a journey in computer science could exceed the 
appeal of videogames or doom-scrolling? Somehow I've managed to achieve this 
myself in spite of being a long-time pc gamer (nothing against videogames, by the 
way, I love them!). At a minimum, you've probably spent the last 12 years of your 
life learning stuff that you didn't find very important. I'm going to help you 
plant your feet firmly on the ground so you won't have to feel like you're 
floating along anymore. For the first time (maybe), we are going to unlock your 
internal motivation to grow in personal competence. Keep reading! `,
`Who is this course for?

Really anyone who thinks computers are cool and that they might want to do more 
with them, maybe even start a career around them. Like I said before, I've made 
this course for the average person. I do assume at certain points that you have 
basic knowledge of how to use a computer. If you find yourself stuck, don't 
hesitate to ask ChatGPT or a similar LLM for help. 

I take a different point of view from mainstream computer programming education. 
It's worth it to spend more time on the front end laying the foundation that you 
will continue to build on for the rest of your career. Worried that computer 
science might not be for you? Don't worry, you'll find out pretty quickly if 
computer science is something that you want to progress further in.  Don't be 
fooled though! There is a cost to laying a solid foundation. The cost is time. 
It's worth it, but there is a cost. If you're life is unstable at the moment, you 
have an uphill battle in front of you! Try to nail down an income source and get 
to a point where you can "turtle-up" and give yourself the solid start in 
computer science that you need. `,
`If you're a highschooler or college-age student in a stable living situation, 
fantastic! Take full advantage of the opportunity your parents gave you and use 
your free time to build the most robust foundation that you can. And here, get 
this: I'm going to help you unlock the fun in computer science. We're going to 
have a blast!

If you would, please fill out this survey. I want to know more about the people 
who are checking out my educational material.

And with that, let's get cooking!`,
  ]
};

function navSelectChapter (navState, material, chapterIndex) {
  if (0 <= chapterIndex && chapterIndex <= navState.chapters.length - 1) {
    navState.selectedChapter = chapterIndex;
    if (navState.selectedChapter < navState.top + 1) {
      navState.top--;
      if (navState.top < 0) {
        navState.top = 0;
      }
    }
    const bottomIndex = navState.top + navState.list.childNodes.length - 1;
    if (navState.selectedChapter > bottomIndex - 1) {
      if (bottomIndex < navState.chapters.length - 1) {
        navState.top++;
      }
    }
    navPopulate(navState);
    navState.list.querySelectorAll("li").forEach(function (li) {
      if (parseInt(li.getAttribute("index")) == navState.selectedChapter) {
        li.classList.add("selected");
      }
      else {
        li.classList.remove("selected");
      }
    });
    navSelectPage(navState, material, 0);
    navDrawPageControl(navState, material);
  }
}

function navInitializeUI (navState, material) {
  navState.list.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
      navSelectChapter(navState, material, parseInt(e.target.getAttribute("index")));
    }
  })

  const navButtons = document.getElementById("nav-bottom-buttons");
  navButtons.addEventListener("click", function (e) {
    if (e.target.id == "nav-down") {
      navSelectChapter(navState, material, navState.selectedChapter + 1);
    }
    if (e.target.id == "nav-up") {
      navSelectChapter(navState, material, navState.selectedChapter - 1);
    }
  })

  navState.element.addEventListener("wheel", function (e) {
    HandleScroll(e, navState, function (amount) {
      const bottomIndex = navState.top + navState.list.childNodes.length - 1;
      if (amount == -1 && navState.top != 0 || amount == 1 && bottomIndex < navState.chapters.length - 1) {
        navState.top += amount;
        navPopulate(navState);
      }
    });
  });

  document.onkeydown = function (e) {
    switch(e.code) {
      case "KeyL":
      case "ArrowRight":
        navSelectPage(navState, material, navState.selectedPage + 1);
        break;
      case "KeyH":
      case "ArrowLeft":
        navSelectPage(navState, material, navState.selectedPage - 1);
        break;
      case "KeyP":
      case "KeyK":
        navSelectChapter(navState, material, navState.selectedChapter - 1);
        break;
      case "KeyJ":
      case "KeyN":
        navSelectChapter(navState, material, navState.selectedChapter + 1);
        break;
      case "Slash":
        if (e.shiftKey) {
          articleOveride(navState, material, "help", 0);
        }
        break;
      case "Escape":
        navSelectChapter(navState, material, navState.selectedChapter);
        break;
    }
  };
}

function navScroll (amount) {
  const bottomIndex = navState.top + navState.list.childNodes.length - 1;
  if (amount == -1 && navState.top != 0 || amount == 1 && bottomIndex < navState.chapters.length - 1) {
    navState.top += amount;
    navPopulate(navState);
  }
}

navInitializeUI(Nav, courseMaterial);
navPopulate(Nav);

window.addEventListener('resize', resize);
resize();

navSelectPage(Nav, courseMaterial, 0);
