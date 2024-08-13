Main is now Depracated, Latest Integrated code is now on New-Main, Each individual branch also should have each user's features


# Liu Jun Yi Jerald Educational Modules
For the educational module Backup-2 is working 
There is two sections of the educational module I have made. One is a quiz and another is the ResourceLibrary.
Staff Can add quizzes and resources which have their own type and can be active or inactive which will determine
if they are shown to the user. In the quiz and resource library when staff adds them, they will need to click the edit button to be able to add questions or content in the pages. For the quiz, there are 2 types of questions, multiple_choice and open ended questions.
For the open ended questions, they are marked by an Machine Learning model from hugging face which checks the sematics of
the correct answer and the user answer the answer will be correct if they similarty score is above 0.5. The ML might take 
some time to load so give it a while. Once you submit the quiz, an email will be sent detailing the quiz title, score and date taken.
For the resource library, you can add text, videos, files for users to download, images and video links like youtube videos. After taking the quiz, the quiz will be upload to the quiz history for the user to view.