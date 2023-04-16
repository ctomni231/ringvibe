--------------------
Ringvibe Description
--------------------

Life is boring. Escape reality. Use your cursor to bring life and color to a dark and meaningless world.

-----
Hints
-----

Beginner Hints - "HELP! I KEEP LOSING AND I DON'T KNOW WHY!!!"

- Try clicking and exploding one ring at a time. 
- Red rings increase time the fastest.
- Your goal is to fill the top timer bar with color. 
- Speed and accuracy are very important when chaining rings together! 

Intermediate Hints:

- Select and destroy rings quickly to fill the timer bar fast and progress through the levels.
- Linking rings is high risk, high reward; Link rings without missing a click to save precious time.
- Aim for red, orange, and yellow rings when low on time to stay in the game longer.
- Green, Blue, and Purple rings are excellent for breaking new high scores.

-------------------------------------------
Ringvibe - Complete Instructions - Advanced
-------------------------------------------

Left-Click: Select Rings
You can select as many as you want causing them to link. Linking rings causes your time to drain slowly, as long as you are accurate.

Right-Click: Destroy All Rings
To stop time from dropping, you must destroy the linked rings. All linked rings explode together in chains. Each ring holds a time and score value which is added to your time and score.

Score Value: [Red - 10] [Orange - 20] [Yellow - 30] [Green - 40] [Blue - 50] [Purple - 60]
The higher the Score value of a ring, the less time value it has when destroyed. Red rings produce the highest time.

Timer Bar: Fill up the timer bar with color to progress through the levels. If the timer bar loses all the color, you lose the game. In the middle of the timer bar is your score.

Power-ups: They are located randomly in the center of rings. Powerups are unlocked as you progress through the levels. Diamond shaped ones affect the score, Hourglass ones affect the time. 

- Bonus Reel: Adds 100 points of score or time to bonus reel. Known to increase in value over time.
- #x Chain: This multiplies the score and time value of rings by #.
- Bomb-Clear: Maximizes the value of rings and has a high chance of exploding all visible rings on screen, but it only affects either score or time.

The more rings you link together, the more powerful power-ups become.Try not to explode power-up links for as long as you can!

//All power-ups are cumulative and can combine to make really powerful effects. Try not to explode power-up links for //as long as you can!

To quit in-game: Hold down right mouse button for 5 sec over the timer bar.

To win: Get to level 7 - You're a master of the game... 
To slaughter: Get to level 13 - You're just insane!

Thanks for playing Ringvibe! Good Luck!

--------------
Optimization
-------------

There is a multitude of things I learned during this competition about optimization.

1) Use "for" loops when you have to repeat calls more than once. It can save a few bytes.
2) Keep your code short and concise as possible.
3) Ternary operators are very good for shaving off bytes.
4) Use small numbers 127 and below.
5) Java calls to constants save the constant name in memory. Avoid calls to class variables and reduce import calls.
6) Combine your initializations (int i,j,k) and also combine variable changes (rx[i] = ry[i] = 0) to save memory.
7) Make sure to call the most basic classes (Graphics instead of Graphics2D). Set your target JRE as low as you can.
8) Integers are your best friend when trying to keep things small. Use ints for as many things as you can.
9) Reuse integers as much as you can. You only need one int i to do all for loops. "for" loops are the most efficient.
10) "if-else" and "if-elseif" statements are much more expensive than just using "if" by itself. Only use when needed.
11) Function calls are stored in Strings, which take up a lot of memory. Reduce to shave off massive bytes.
12) If a number needs to repeat in a loop (like degrees), use modular % to trancate it. Shaves off massive bytes.
13) Manifest files lowest byte count is 15 bytes. Use 7-zip to achieve this very small size.


Optimization Route

ProGuard 4.7 -> Joga -> 7-zip (Gives you the smallest possible output in one shot.)

-----------------
Ring Spinner Code
-----------------

g.drawArc(rx[i]+2, ry[i]+2, 36, 36, k%(60*6), 20);
g.drawArc(rx[i]+2, ry[i]+2, 36, 36, k+90%(60*6), 20);
g.drawArc(rx[i]+2, ry[i]+2, 36, 36, k+180%(60*6), 20);
g.drawArc(rx[i]+2, ry[i]+2, 36, 36, k+270%(60*6), 20);

-----------------
Ring Creation Original
-----------------

if(rg[1] != 0 && rg[4] >= 0 && rg[4] < 20){
	ra[i] = rd.nextInt(6)+1;
	rx[i] = rg[4]*40;
	ry[i] = rg[1] > 0 ? -100 : 70*10;
}else if(rg[0] != 0 && rg[4] > -15 && rg[4] < 0){
	ra[i] = rd.nextInt(6)+1;
	rx[i] = rg[0] > 0 ? -100 : 90*10;
	ry[i] = (-rg[4]*40)+1;
}
rg[4] = rd.nextInt(120);
if(ra[i] != 0 && rg[4] <= rg[14])
	ra[i] += 6*(rg[4]%7);
break;

--------
Features
--------

- Six rings with different score and time values.
- Six separate power-ups each with unique images and abilities.
- Custom font.
- Ranking system.
- Quit in-game.
- Color changing backgrounds.
- Screen shaking.

---------------
Forum Comments
---------------

ra4king - Congrats! You are the first person (excluding Riven) to have embedded an applet on this forum. Also you have successfully sucked up a whole half hour of my life.

ReBirth - 5300

Screem - 37330 - Level 5 - Wow, this is really fun! The little loops remind me of Fruit Loops.  Level five is quite a challenge.

------------------------------------------
Community Results - #43 Place - 29 points 
------------------------------------------
[#45 / 26 points] (Not counting my own 3 points...)

Top 50 - Out of 68

48% - Farmer John and the Birds (2013)
36% - Ringvibe (2013)
17% - Bot Blaster (2012)
11% - Jewel Cr4sh (2012)

-------------------
Community Comments
-------------------

moogie - a lot of instructions to keep in my head causing frustration and no real[l] sense of pleasure, however well thought out and potentially addict(ing.)

grunnt - A bit complex, fun when you get it, nice and colorful.

pjt33 - Interesting concept, tending a bit towards R(epetitive) S(train) I(njury) -fest.

Morre - Very cool! I'm really enjoying the graphics in particular. Well done!

googlegamer - Great achievement man. Keep up the good work.

townsendr - Neat game, but a lot of instructions to read!

dapy - score 20310, level 5 nice game, very polished!

------------------------------------
Judging Results - #34 Place - 65.3%
------------------------------------

Top 50 - Out of 68

95% - Farmer John and the Birds (2013) [Judge - 91.7%] 
50% - Ringvibe (2013) [Judge - 65.3%]
33% - Jewel Cr4sh (2012) [Judge - 64.4%]
21% - Bot Blaster (2012) [Judge - 59%]

----------------
Judging Comments
----------------

*******************
Arni Arent (appel)
Overall: 68%   
******************* 

I think you got a candidate for making a good game out of this.

Currently, it is too fast-paced for my slow senses. Hard to determine the colors because of the fast spin, the white in the rings masks the color a bit.

Score value depending on color is difficult to understand. Rather make the rings of different thickness, thick means higher score and thin mean less score.

I did not understand how clicking different rings of different colors affected the game, or what chaining did.

But as I said, difficult to play because of various issues, but I recognize there's a lot of potential here. If you refine it visually, make it more casual and try to make the game rules simple and easy, you might have something.

*************
Drabiter
Overall: 74%  
*************

Visuals are greatly polished. Game play is interesting. The combination between time and score hunt makes this fun to play. It really needs sound to spice up.

Room for improvement: Hold right click for chain linking. Spawn more rings. Explode sound effect.

**************
Roi (ra4king)
Overall: 88%    
**************

Quite an enjoyable game! I love the unique idea and fun gameplay. Controls were good and graphics are cool :)