
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
      pageControlString += "●";
    } else {
      pageControlString += "○";
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
    { title: "01 Introduction", tHeight: 1, id: 0 },
    { title: "02 What is data\nProcessing?", tHeight: 2, id: 1 },
    { title: "03 What does \ndata look like?", tHeight: 2, id: 2 },
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
  "counter": [
    `<div class="widget" variant="counter">
       <span class="digit blur" symbol="1">1</span>
     </div>
    `,
    ],
  "help": [
`            HELP

       F11: toggle fullscreen
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

(Press the left arrow-key or h if you want to go back to a previous page)`,
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
    ],
  1: [
`Computers are all around us, but they are pretty complicated, aren't they? Hey, 
welcome to my course. I've called it "foundations of automated computing" because 
the key to understanding the computers we have today is taking a good look at 
where they came from. This is going to be a very hands-on approach to computer 
science. I hope you have fun going through it with me! 

As you could probably guess, I do in fact have a computer right here in front of 
me. We're going to crack it open and see what's inside, but first I want to 
answer the question of "why?"

Aristotle would agree with me that understanding the purpose of computers is a 
critical first step to understand their function. So why do we have computers?

Here's a tip: what was life like before we had computers?

Well, we sure had to do a whole lot more work by hand! 

Notice I used the word "work". Now that's an awfully funny thing to say. Right, 
the last time you looked at your computer, I'm sure you didn't see any arms or 
legs popping out of it (yes, you can hold your comments about robots. Thank you).
`,
`I haven't known computers to lay bricks, cook and clean, or do laundry for 
example.

Alright, so the work that computers can do is called <span class="highlight">"DATA PROCESSING"</span>. And that 
is actually the only kind of work they can do. 

Now that's not a very widely used term: <span class="highlight">"DATA PROCESSING"</span>. So what is it?

I think the best way to explain is to go back in time a ways and tell you a 
story. It's about arguably the first impactful use of electronic computing 
machines ever!`,
`The year was 1890. The US population was positively booming, and we had a big 
problem on our hands. See, the constitution says we have to do a census once 
every ten years. Now the last census we just did took a whole eight years to 
complete. We just finished it barely two years ago! Not only that, we had even 
more information to collect this time. Experts predicted that we would still be 
awaiting the results by the time we needed to start the census for the year 1900. 
I'm sure you can agree that is just no good. 

We really needed a creative solution to this problem! So we got the best brains 
together and found an answer. We were going to use a computing machine.

(Disclaimer: the details of this part of the story are severely simplified so we 
can focus on the important bits. Follow <a class="inline green" target="_blank" href="https://en.wikipedia.org/wiki/Tabulating_machine" >this link</a> for the whole story)`,
`Alright so picture this: you've got a card. 

┌──────────────────────┐
│○ male ○ female       │
│○ married ○ single    │
│Farmer? ○ Yes ○ No    │
│Age:                  │
│○ 0-17, ○ 18-39, ○ 40+│
└──────────────────────┘

As you can see, there's a whole bunch of details on the card. Everything the 
government might want to know about an average citizen. So here's what you do: 
you punch a hole in the card. At every data-point that applies to you, you punch 
a hole. Now you give one of those cards to every person in the US. Right, 
probably have 'em come down to the town hall and fill out a card. And now, we've 
sent all those cards back to Washington DC. Well I'm sure you'll agree that those 
cards are in fact DATA. But is it useful? Can you really get a good picture of 
the breakdown of the US population by sifting through cards in millions of boxes?

...Probably not.
`,
`So what do we have to do? Well, that data is not useful in its current form. But 
maybe if we were to process this data, we could turn it into something more 
useful? We could use a process called tabulation to put down the number of people 
that fit into each one of our categories. 

And that's exactly what we did. We used a machine named after the gentleman who 
invented it: The Hollerith Tabulating Machine.`,
`┌────────────────────────────────────────┐ So here's how the machine worked. 
│                                        │ (A) You had a slot here. You put a 
│                                        │ card in and then when you pulled down 
│                                        │ the lever, a whole bunch of needles 
│                                        │ came down onto the card. Now here's 
│                                        │ the cool part: if a needle found a 
│                                        │ hole, it would go through and dip 
│                                        │ into a pool of mercury to create an 
│                                        │ electronic circuit! You had one 
│                                        │ circuit for each data-point, and each 
│                                        │ circuit was connected to a dial on the 
│                                        │ front panel (B). So when you ran a 
│                                        │ card, you would see a matching dial go 
│                                        │ up in count for each selection you 
│                                        │ made on the card.
│                                        │
│                                        │
└────────────────────────────────────────┘

<img class="image" src="images/tab-machine.png" width="50%"/>`,
`So not much more to it, once you ran every single card you would be finished! 
Only thing left to do is tally up the dials and report back to the people in 
charge.
    
Turns out that using computing machines was a really good idea. It only took six 
years to finish, a whole two years less than last time, and we had more to do!
    
Now, I'm sure you're aware that computers have come a long way since 1890. 
However, we still do data processing on our computers today. 
    
What kinds of things do you do with your computer?`,
`I'm definitely going to date myself here, but perhaps at some point in the past 
you had the desire to watch a DVD on your computer. Now think about that DVD. 
It's data, right? Well, yes, it's got a movie on it. But is it useful? Again, not 
in its current form. So we need to transform or process that data into something 
we can perceive; something we can enjoy. So what does your computer do? It 
processes the data on that DVD into video that appears on the screen and sound 
that comes out of your speakers.`,
`Cool, here's another example. I'm sure you've used a text editing program like 
Microsoft word at one point or another! Well think about it. You know your 
document is stored on your computer's hard drive. When you open your file, your 
computer has to process the data it finds there on the hard drive so it can go up 
on your screen. When you start typing, each key-press is a little bit of data 
that your computer has to process into new letters and other characters that 
appear on your document. When you're done, you move your mouse up to the file 
button...You just moved your mouse! Your mouse is (perhaps) wired up to your 
computer! You've got a Universal Serial Bus right there! There's data traveling 
along that cord right into your computer. Each time you move your mouse a 
miniscule amount, that's a little bit of data your computer has to process in 
order for your mouse to move across the screen. When you click on the file 
button, even that is more data sent to the computer. Click "save" and now your 
computer will take the words you had up on the screen and store them back in the 
hard drive for safe keeping.`,
`So you can see that even though we do some pretty awesome things on our 
computers nowadays, it's just data processing all the way down. 

Ok cool, but what exactly is this data I keep talking about? What does it look 
like? Let's figure that out in the next chapter.`,
  ],
  2: [
`Alrighty! We are just about ready to crack open this puppy and find out what's 
happening on the inside. I've something on my desktop that I want to show you. 

Let's get a couple things out of the way first though. 

In order to get the most out of this series, you really do need to follow along. 
Download the things things I'm downloading, everything I'm doing on my computer, 
you do on yours. Hopefully you have a windows computer! If you use a Mac, you can 
still follow along, you may just have to look up a couple things on your own 
(ChatGPT will come in handy for that!) sorry about that! We're using windows 
because guess what? Most people use windows.`,
`Ok, next let me introduce you to my old friend, <span class="highlight">[alt]-[tab]</span>. It's gonna be a 
life-saver for you. Hold down <span class="highlight">[alt]</span> with your thumb and tap <span class="highlight">[tab]</span> with your 
pinky. Now when you release <span class="highlight">[alt]</span> it will take you to whatever window you have 
highlighted. (you can press <span class="highlight">[tab]</span> multiple times to cycle through the different 
windows)
Do it with me now: <span class="highlight">[alt]-[tab]</span>, <span class="highlight">[alt]-[tab]</span>. Perfect!
    
(I designed this website to work well in full-screen. Press F11)
    
Alright, I think we are good to go.`,
`Have you ever heard anybody say "oh you know, computers, they're all just 
zeroes and ones!" And it's like, yeah, ok, you can tell me that, but I've used a 
computer before! We've got letters, pictures, video...lots of stuff that ain't 
zeroes and ones! So what exactly are they trying to tell us here?`,
`                             










I've got an image file on my desktop for us to take a look at. I want you to 
right-click on a blank spot on this website and then select "Save image as..." 
and save it to your desktop. Great. Now you've got the same file that I do. 

Now chances are you don't have this "-.jpg" like I have on the end. But it's 
probably just hiding.

<img class="image" src="images/02-jpg-file.jpg" width="30%"/>`,
`

















Search "show file extensions" on the windows search bar and press <span class="highlight">[enter]<span>. 

<img class="image" src="images/02-show-file-extensions.jpg" width="40%"/>`,
`

















Click "Show settings".

<img class="image" src="images/02-show-settings.jpg" width="200%"/>`,
`

















Disable "Hide extensions for known file types".

<img class="image" src="images/02-hide-extensions.jpg" width="50%"/>`,
`Ok, now you'll see "-.jpg" or "-.png" or something similar at the end of your 
file at home. If you were unaware, this part of the filename is called the <span class="highlight">FILE 
EXTENSION</span>. It's meant to give your computer's system an idea of how this file was 
intended to be processed when it was given to you. `,
`








Now we're going to use some very special software to peek inside this file to see 
what it really looks like! 

<img class="image" src="images/02-scooby.jpg" width="30%"/>`,
`

















<a class="inline green" target="_blank" href="https://mh-nexus.de/en/downloads.php?product=HxD20" >Download</a> and install HxD.

<img class="image" src="images/02-download-hxd.jpg" width="200%"/>`,
`












Cool beans. Alright let's use HxD to open this image file up. (Here's some settings to 
change so that the content is easier to read)
<img class="image" src="images/02-settings-p1.jpg" width="20%"/>`,
` <img class="image" src="images/02-settings-p2.jpg" width="3000%"/>`,
` <img class="image" src="images/02-settings-p3.jpg" width="3000%"/>`,
`


















See this part in the middle here? Believe it or not, this is the entirety of your 
image file. 
<img class="image" src="images/02-hxd-jpg.jpg" width="70%"/>`,
`Ok, remember when I said earlier that computers are all just zeroes and ones? 
It's true. Now I can already hear you: "that doesn't look like zeroes and ones to 
me!". Well, you're kind of right. What you're looking at here is called 
<span class="highlight">HEXIDECIMAL NOTATION</span>. It's a way of notating zeroes and ones.

Still confused? No worries! Everything will be made clear. And to help us on our 
way, I have another story for you!`,
`This time we are going further back in history to the revolutionary war. You 
ever heard of a guy named Paul Revere? Right, "Midnight Ride of Paul Revere"? 
"One if by land, two if by sea?".

Robert Newman was tasked with hanging lanterns in the steeple of the Old North 
Church so Paul Revere could alert everyone where the British were coming from. He 
was able to communicate with him just by using laterns! Paul could look up at the 
church and see whether there was one light or two lights. That was all he needed 
to know where the British were coming from.

Now think about that... you can communicate very critical information with 
someone just with two observable devices (lanterns in this case) being <span class="highlight">on or off<span>. 
Pretty neat, right?`,
`Here's another example: did you ever watch Return of the King? At one point, 
Pippin has to go up and light the beacon. The light from the beacon would go from 
Minas Terith all the way over to Rohan to communicate a very important message: 
If the beacon is off, that means "Hey, you know, we're chilling", but as soon as 
that beacon is lit that means, "Uh oh! Something's going down! We're in 
trouble!". That proves you can communicate with someone and indicate <span class="highlight">one of two 
different situations</span> with even just one thing being <span class="highlight">on or off</span>.

Now think about Paul Revere's case. How come he needed two lights? Pippin was 
able to indicate one of two different situations with one light. If Robert and 
Paul only had two cases to indicate (one if by land, two if by sea), wouldn't one 
light be enough?`,
`Good question. Alright let's think about it: so you've got one if by land and 
two if by sea. Now imagine you're Paul Revere looking up at the Old North Church 
and you don't see any lanterns. What does that mean? It means we don't know yet! 
So watch and wait. Wait for the signal... so really there were three different 
situations to communicate. He needed an additional light to differentiate between 
those situations since there were more than two.

Quick note: There is a key component to being able to communicate with lights. 
You need a shared understanding between the person turning the lights on and off 
and the person who is looking at the lights. Of course, everyone refers to this 
kind of shared understanding as a <span class="highlight">code!</span> If someone was going for an evening 
stroll near Boston and they saw some lights up in the steeple of the Old North 
Church, they would probably think "huh, I wonder what those lights are there 
for?", but that would be about it. Only the ones who knew the <span class="highlight">code</span> could make 
sense of those lights.`,
`Now if you know what you're doing, you can actually indicate more than three 
possible situations with two lights (This may not have worked in Paul Revere's 
case as he needed to clearly see the positions of the lights even if they were 
both off). All you need is to map all the different combinations of two lights 
being on or off to the different situations you're trying to communicate. So how 
many combinations do we have? Here's an easy way to think about it:
 
How many combinations with just one light (not technically a combination, I 
suppose, but bear with me)? Obviously two, one with the light off, and the other 
with it on.
<span class="white">
                   Light 1 
    Combination 1: <span class="gray">○ (off)</span>
    Combination 2: ● <span class="gray">(on)</span>
</span>`,
`So if you have two lights, you have all the combinations of the first one 
with the second one off (study these figures carefully. The first light is on 
the left of the second light):
<span class="white">
                   L2 L1 
    Combination 1: <span class="gray">○  ○ (off, off)</span>
    Combination 2: <span class="gray">○</span>  <span class="white">●</span> <span class="gray">(off, on)</span>
 </span>   
And all the combinations of the first light with the second one on:
<span class="white">
                   L2 L1 
    Combination 3: <span class="white">●</span>  <span class="gray">○ (on, off)</span>
    Combination 4: <span class="white">●  ●</span> <span class="gray">(on, on)</span>
 </span>   
Here they are all together:
<span class="white">
                   L2 L1 
    Combination 1: <span class="gray">○  ○ (off, off)</span>
    Combination 2: <span class="gray">○</span>  <span class="white">●</span> <span class="gray">(off, on)</span>
    Combination 3: <span class="white">●</span>  <span class="gray">○ (on, off)</span>
    Combination 4: <span class="white">●  ●</span> <span class="gray">(on, on)</span>
</span>   
Yep, those are all unique combinations! `,
`Maybe you would want to communicate a cardinal direction with somebody:
<span class="white">
           L2 L1 
    North: ○  ○                            
    South: ○  <span class="white">●</span>
    West:  <span class="white">●</span>  ○  
    East:  <span class="white">●  ●</span>
</span>   
Two lights would be enough for that! We would call a chart like this an <span class="highlight">ENCODING 
STANDARD</span>. All that means is that we've decided ahead of time all the different 
situations we want to indicate for a data-point and assigned a unique combination 
of lights to each one. Right? We've come up with a <span class="highlight">STANDARD</span> that we can share 
with anyone in the world that will allow them to correctly interpret or <span class="highlight">DECODE</span> 
our data.
`,
`
<span class="white">
            L2 L1 
          ┌──────┐
          │ ○  ○ │ <span class="gray">ENCODED DATA</span>
          └──────┘
            ▼  ▼
   ┌─────────────┐
   │ North: ○  ○ │  
   │ South: ○  <span class="white">●</span> │ <span class="gray">ENCODING STANDARD</span>
   │ West:  <span class="white">●</span>  ○ │ 
   │ East:  <span class="white">●  ●</span> │
   └─────────────┘
            ▼  ▼
         ┌───────┐
         │ North │ <span class="gray">DECODED DATA</span>
         └───────┘


</span>   
`,
]
};

function widgetCounter (el) {
  const digits = el.querySelectorAll(".digit");
  el.addEventListener("click", function (e) {
    if (e.target.classList[0] == "digit") {
      e.target.classList.remove("blur");
    }
  });
}

const observer = new MutationObserver(function () {
  const article = document.getElementById("article");
  article.querySelectorAll(".widget").forEach(function (el){
    switch (el.getAttribute("variant")) {
      case "counter":
        widgetCounter(el);
        break;
    }
  });
})

navInitializeUI(Nav, courseMaterial);
navPopulate(Nav);

window.addEventListener('resize', resize);
resize();

navSelectPage(Nav, courseMaterial, 0);
observer.observe(document.getElementById("article"), { childList: true });
articleOveride(Nav, courseMaterial, "counter", 0);
