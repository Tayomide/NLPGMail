// A google script that takes advantage of embeddings and sentiment analysis to add labels to mails
function myFunction() {
  // Labels and list of templates that should be labelled if similar
  const labelLib = {
    "Accepted": [
      `
        Dear [Applicant's Name],

        Congratulations! We are delighted to inform you that you have been accepted into [School Name] for the [Academic Year] term. Your application was impressive, and we believe that you will make a valuable addition to our diverse and dynamic community.

        Your commitment to academic excellence, along with your demonstrated passion for learning and extracurricular activities, stood out during our rigorous selection process. We are confident that your contributions will enhance the overall learning environment at our school.

        To secure your place at [School Name], please follow the enrollment instructions provided in the attached acceptance packet. This packet contains important information about the next steps, including enrollment deadlines, orientation dates, and any necessary documentation.

        We understand that embarking on this educational journey is a significant step, and we are here to support you every step of the way. Our dedicated faculty, staff, and fellow students are excited to welcome you to our community.

        Should you have any questions or require additional information, please do not hesitate to contact our Admissions Office at [Phone Number] or [Email Address]. We are here to assist you and ensure a smooth transition to [School Name].

        Once again, congratulations on your acceptance to [School Name]. We eagerly anticipate the contributions you will make and the achievements you will accomplish during your time with us.

        We look forward to welcoming you in person and wish you a successful and enriching academic journey at [School Name].

        Sincerely,
      `
    ],
    "Rejection": [
      `
        Dear [Applicant's Name],

        We appreciate your interest in [School Name] and the time you invested in submitting your application for admission to our institution. The Admissions Committee has carefully reviewed your application, and while we understand the effort you put into it, we regret to inform you that we are unable to offer you a place in our incoming class for the [Academic Year] term.

        The selection process was highly competitive this year, and we received an exceptional number of applications from talented individuals. Unfortunately, we have a limited number of available spots, and after a thorough evaluation of all applicants, we had to make some difficult decisions.

        We understand that this news may be disappointing, and we want to assure you that this decision in no way reflects your personal worth or abilities. The admissions process is a complex one, taking into account various factors, and our decision was based on what we believe will create the best possible learning environment for all students.

        We encourage you to explore other educational opportunities that align with your aspirations and goals. Your dedication and passion will undoubtedly contribute positively to whichever path you choose.

        If you would like to discuss your application and receive feedback on your materials, we are more than willing to schedule a meeting or phone call with a member of our admissions team. Please contact our Admissions Office at [Phone Number] or [Email Address] to arrange a suitable time.

        Once again, we appreciate your interest in [School Name]. We wish you all the best in your future endeavors and hope that your journey is filled with success and meaningful experiences.

        Sincerely,
      `,
      `
        Dear [Applicant's Name],

        We would like to express our sincere gratitude for taking the time to apply for the [Job Position] at [Company Name]. Your interest in joining our team is genuinely appreciated. The hiring process was both competitive and challenging, and after careful consideration, we regret to inform you that we have selected another candidate for the position.

        We recognize the effort and enthusiasm you put into your application, as well as the skills and experience you would have brought to the role. The decision was not easy, and we wish to assure you that it was made after a comprehensive evaluation of all candidates.

        While we are unable to proceed with your application for this specific position, we are impressed by your background and qualifications. Your information will be retained in our database, and we encourage you to explore future opportunities with [Company Name].

        Your commitment to excellence is commendable, and we believe that you will find a fitting match for your skills and aspirations. We wish you every success in your job search and future endeavors.

        If you have any questions or would like to receive feedback on your application, please feel free to contact our Human Resources department at [Phone Number] or [Email Address].

        Thank you once again for your interest in [Company Name]. We appreciate your understanding and wish you all the best in your career journey.

        Sincerely,
      `
    ],
    "Business": [
      `
        Dear [Recipient's Name],

        I hope this email finds you well. My name is [Your Name], and I am writing to inquire about your [Product/Service]. I came across your company while researching options, and I was impressed by the quality and reputation you have in the industry.

        I am particularly interested in [Specific Product/Service] and would like to learn more about its features, pricing, and any available customization options. Could you kindly provide me with detailed information, including any relevant brochures or catalogs?

        Furthermore, I would appreciate it if you could clarify the ordering process, payment methods, and delivery timelines. As my project timeline is [mention timeline if applicable], prompt responses would be greatly appreciated.

        If possible, I would also like to request a demonstration or consultation to better understand how [Product/Service] can meet my specific needs.

        Please find my contact details below:

        Name: [Your Name]
        Company Name: [Your Company Name]
        Email: [Your Email Address]
        Phone: [Your Phone Number]
        Thank you for considering my inquiry. I am looking forward to your prompt response and the opportunity to explore a potential partnership.

        Best regards,
      `,
      `
        Hi [Recipient's Name],

        I hope this email finds you well. I wanted to provide you with an update on our ongoing project, [Project Name].

        I'm pleased to share that we've reached a significant milestone in the project. As of [Date], we successfully completed [Brief Description of Milestone Achieved]. This accomplishment was a result of the collaborative effort of our team and the dedication of everyone involved.

        Key highlights from this milestone include:

        [Highlight 1]
        [Highlight 2]
        [Highlight 3]
        Moving forward, our next steps involve [Brief Description of Next Steps]. We are on track with our timeline and are confident that we will continue to make excellent progress.

        If you have any questions or would like more detailed information about this milestone or our future plans, please don't hesitate to reach out. Your insights and feedback are always valuable to us.

        Thank you for your continued support, and I look forward to updating you further as we make further strides in the project.

        Best regards,
      `
    ],
    "Blackboard": [
      `
        ITMD_547_447.202410
        Fall 2023 Web Systems Integration
        New content
        Integrating Google SRE and DevOps into Web Systems 
        View
        Email brought to you by
        Want to change how you receive these emails?
        Manage your notification settings
      `
    ]
  };

  // Constants
  // :messageLimit int: Amount of threads gotten from gmail
  // :chunkLength int: How long a chunk of text for embedding should be
  // :overlap int: Overlap between previous chunk of text and current
  // :threshold int: How similar a chunk should be to the label before assigning a label
  const messageLimit = 20; 
  const chunkLength = 480;
  const overlap = 10;
  const threshold = 0.65;

  // Create labels if they don't exist and exclude them from search query
  let excludeTags = "";
  for(const label of Object.keys(labelLib)){
    excludeTags += ` -label:${label}`;
    if(!GmailApp.getUserLabelByName(label)){
      GmailApp.createLabel(label);
    }
  }

  // Function to make a POST request to a server to get embeddings and text
  const getEmbedding = (text) => {
    // Define paramaters
    const url = '<INSERT YOUR SERVER URL LINK HERE>';//Remove string and add your URL LINK for this script to work
    const payload = {
      text: text,
      chunkLength,
      overlap
    };
    
    // Define options for POST request
    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload)
    };
    
    // Get response
    const response = UrlFetchApp.fetch(url, options);
    
    // Process the response
    const responseBody = response.getContentText();
    const responseData = JSON.parse(responseBody);

    // Assign embeddings to constant
    const embeddings = responseData.embeddings;

    // Check parsed text
    console.log(responseData.text)

    return embeddings;
  }

  // Function for performing similarity check
  // :chunkEmbedding List[float]: Embedding/Vector representation of chunk
  // :demoEmbedding List[float]: Embedding/Vector representation of label template
  const dotProduct = (chunkEmbedding, demoEmbedding) => {
    if (chunkEmbedding.length !== demoEmbedding.length) {
      throw new Error('Both arguments must have the same length');
    }

    let result = 0;

    for (let i = 0; i < chunkEmbedding.length; i++) {
      result += chunkEmbedding[i] * demoEmbedding[i];
    }

    return result;
  }

  // Map to store label templates embeddings 
  const labelEmbeddings = {};

  // Replace label templates with embeddings
  for(const label of Object.keys(labelLib)){
    console.log(label);
    labelEmbeddings[label] = [];
    for(const demoMail of labelLib[label]){
      labelEmbeddings[label].push(getEmbedding(demoMail)[0]);
    }
  }

  // Get top (messageLimit / {20}) threads
  const threads = GmailApp.search('has:nouserlabels -in:draft' + excludeTags,0, messageLimit);
  let messageEmbeddings;

  // Compare the similarity of each chunk of mail with each label template. If similarity > (similarity / {0.85}) add label to thread.
  for(const thread of threads){
    for(const message of thread.getMessages()){
      messageEmbeddings = getEmbedding(message.getBody());
      for(const chunkEmbedding of messageEmbeddings){

        for(const label of Object.keys(labelEmbeddings)){
          for(const demoEmbedding of labelEmbeddings[label]){
            const similarity = dotProduct(chunkEmbedding, demoEmbedding);
            if(similarity >= threshold){
              // Add tag to thread
              thread.addLabel(GmailApp.getUserLabelByName(label));
              console.log(label + " has been added to thread")
              break;
            }
            console.log(label + ": " + similarity );
          }
        }

      }
    }
  }
}