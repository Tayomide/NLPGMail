# NLPGMail
An attempt at integrating NLP and Language theories in real-world scenarios.

# Note
This started out as a [one-day project](https://github.com/Tayomide/NLPGMail/tree/one-day) I created to serve as a proof of concept of an idea I had in class.

# Background
"Genre refers to a conventional category of discourse based on large-scale typification of rhetorical action; as action, it acquires meaning from the situation and from the social context in which that situation arose" - Carolyn Miller.

Forms of genres can be seen all around us, from tags to labels. I believe the ability of a computer to understand language could lead to the automation of most drudgery. This is my attempt to automate the labeling of emails, leading to an improved workflow, a more structured and tidy mail, a backing up of mail into folders, and much more without the need for manual labeling.

# Structure
- The ```server``` folder is my node.js server that deals with the cleaning up, chunking, and embedding of Gmail messages
- The [```google script```](https://script.google.com/d/1H58ZZzO4FHyYkskSXbv8crMdN2EAXD7T6ierdAqmG7mYxdl1i2J1ezbL/edit?usp=sharing) contains the code needed.

# Before/After
![Before Script Image](https://github.com/Tayomide/NLPGMail/blob/main/assets/images/before-script.png)
![After Script Image](https://github.com/Tayomide/NLPGMail/blob/main/assets/images/after-script.png)

## Note
I added "blackboard" to the search query to ensure the script matches with emails that are likely to be from Blackboard.

# Steps to reproduce

## Server
1. Clone repository
2. Run this command ```$ cd server && npm install && npm run start``` in a terminal at the root directory of the local repository you just cloned for testing
3. Follow this [tutorial](https://www.freecodecamp.org/news/how-to-deploy-nodejs-application-with-render/) to deploy server (Note: Type ```server``` in the ```Root Directory``` field)

## Google Scripts
1. Go to [Google Scripts](https://script.google.com/d/1H58ZZzO4FHyYkskSXbv8crMdN2EAXD7T6ierdAqmG7mYxdl1i2J1ezbL/edit?usp=sharing)
2. Click on the ```Overview``` button at the left navbar
3. Click on the ```Copy icon``` beside the star at the right to get your own copy of the scripts
4. Replace the ```'<INSERT YOUR SERVER URL LINK HERE>'``` in ```Utility Functions.gs``` line 5, with your server URL + endpoint. It should look similar to this ```https://example.com/embed```
5. Use the keys "Ctrl" + "S" to save
6. Navigate to ```Code.gs```
7. Click on the dropdown at the top left to choose the function you want to run
8. Click the "Run" button at the top left after selecting the function

## Tips
### For better labeling
- Add shorter text.
- Add a descriptive label.
- Add more templates.
- Make templates context-related.
- Run the first function ```labelByClassificationAndClustering```.
### For Automatic running / Labelling a large chunk of mail
- Increase the ```messageLimits``` variable from the ``` Constants.gs ``` file.
- Click the ```clock icon``` at the left and then the ```Add Trigger``` floating action button at the bottom right.
- Change ```manualLabel``` variable in the ```Constants.gs``` file to true. This adds a label for manual labeling if the mail does not match any label
- Change ```noLabel``` variable in the ```Constants.gs``` file to true. This ignores any mail with a user-assigned label. Coupled with ```manualLabel = true```, the code will not check the same mail twice.

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
