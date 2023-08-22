# NLPGMail
An attempt at integrating NLP and Language theories in a real-world scenario.

# Note
This is a one-day project I created to serve as a proof of concept of an idea I had earlier today in class.

# Background
"Genre refers to a conventional category of discourse based on large-scale typification of rhetorical action; as action, it acquires meaning from the situation and from the social context in which that situation arose" - Carolyn Miller.

Forms of genres can be seen all around us, from tags to labels. I believe the ability of a computer to understand us as a human could lead to the automation of most drudgery. This is my attempt to automate the labeling of emails, leading to an improved workflow, a more structured and tidy mail, a backing up of mail into folders, and much more without the need for manual labeling.

# Structure
- The ```server``` folder is my node.js server that deals with the cleaning up, chunking, and embedding of Gmail messages
- The ```Code.gs``` contains a function that works. Although it is a proof of concept. (I plan on adding more functions in the future, but you are welcome to fork or copy this code and create a pull request with your functions

# Before/After
![Before Script Image](https://github.com/Tayomide/NLPGMail/blob/main/assets/images/before-script.png)
![After Script Image](https://github.com/Tayomide/NLPGMail/blob/main/assets/images/after-script.png)

## Note
I added "blackboard" to the search query to ensure the script matches with emails that are likely to be from Blackboard.

# Steps to reproduce

## Server
1. Clone repository
2. Create a repository for the server
3. Copy the server folder content
4. Run the command in a terminal ```npm install && npm run start``` at the root directory of the repository you just created to test locally
5. Follow this [tutorial](https://www.freecodecamp.org/news/how-to-deploy-nodejs-application-with-render/) to deploy server

## Google Scripts
1. Go to [Google Scripts](https://script.google.com/)
2. Click on the "New Project" button
3. Copy any function of your choice and paste it into the file
4. Use the keys "Ctrl" + "S" to save
5. Click on the dropdown at the top left to choose the function you want to run
6. Click the "Run" button at the top left after selecting the function

### Note
You could make the script run automatically at a time interval by clicking the clock icon at the left and then the "Add Trigger" floating action button at the bottom right.

# Optimization
There are several ways to optimize this script. Some of which I plan to implement in the future.
- You can add more templates. The more templates, the less likely it is to miss a mail.
- You could break out of the for loops when one label has been assigned. In most use cases, one label is more than enough for a thread.
- You could reduce the threshold to increase the likelihood of labeling your mail and getting out of the loop. Although this may lead to unrelated emails being labeled if the threshold is too low. The threshold is currently at 0.65.

# Plans for the future
This project is a step toward integrating NLP and language theory using existing technologies in the real world. I would love to see the extremes this project could be pushed to and hopefully collaborate with like-minded people.
1. Add more Google Scripts functions.
2. Use a better embedding model based on the MTEB English leaderboard.
3. Test scripts in various real-world scenarios and see their performance.
4. Add documentation for anyone to use both scripts and server.
5. Fix future bugs.
