import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            super().showPage()
        super().save()

    def draw_page_number(self, page_count):
        # Draw header/footer on all pages except the cover page
        if self._pageNumber > 1:
            self.saveState()
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#6E635D")) # Muted Taupe
            
            # Header
            self.drawString(54, 750, "EVENTSPHERE — QUALITY ASSURANCE & TECHNICAL Q&A GUIDE")
            self.setStrokeColor(colors.HexColor("#C5A880")) # Gold line
            self.setLineWidth(0.5)
            self.line(54, 742, 558, 742)
            
            # Footer
            page_text = f"Page {self._pageNumber} of {page_count}"
            self.drawRightString(558, 40, page_text)
            self.drawString(54, 40, "© EventSphere Portal Project Review")
            self.restoreState()

def build_pdf():
    pdf_path = r"c:\Users\Yash Bhatt\Desktop\Demo\EventSphere_QA_Guide.pdf"
    
    # 54pt margin = 0.75 in
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=72,
        bottomMargin=72
    )

    styles = getSampleStyleSheet()
    
    # Modify default styles or add custom ones
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=32,
        leading=38,
        textColor=colors.HexColor("#2C2623"), # Charcoal
        alignment=0, # Left aligned
        spaceAfter=15
    )
    
    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=13,
        leading=18,
        textColor=colors.HexColor("#6E635D"), # Muted Taupe
        spaceAfter=30
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#2C2623"),
        spaceBefore=25,
        spaceAfter=15,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#C5A880"), # Gold
        spaceBefore=15,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#2C2623"),
        spaceAfter=8
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#2C2623"),
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=6
    )

    story = []

    # --- COVER PAGE ---
    story.append(Spacer(1, 100))
    story.append(Paragraph("<font color='#C5A880'><b>EVENTSPHERE PORTAL</b></font>", ParagraphStyle('Tag', parent=styles['Normal'], fontSize=10, leading=12, textColor=colors.HexColor("#C5A880"), fontName='Helvetica-Bold', spaceAfter=10)))
    story.append(Paragraph("Presentation Q&amp;A Guide", title_style))
    story.append(Paragraph("An exhaustive compilation of 40 Quality Assurance and Technical System review questions and answers.", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#C5A880"), spaceAfter=150))
    
    meta_style = ParagraphStyle('Meta', parent=styles['Normal'], fontSize=9, leading=14, textColor=colors.HexColor("#6E635D"), fontName='Helvetica')
    story.append(Paragraph("<b>Author:</b> EventSphere Core Team", meta_style))
    story.append(Paragraph("<b>Scope:</b> Attendee POV, Technical Architecture, &amp; Testing Layers", meta_style))
    story.append(Paragraph("<b>Status:</b> Verified QA Complete", meta_style))
    story.append(PageBreak())

    # --- PART 1: USER POV ---
    story.append(Paragraph("Part 1: User Point of View (User POV)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#C5A880"), spaceAfter=15))

    q_a_user = [
        ("1. What is the core problem statement that EventSphere solves?",
         "Traditional ticketing websites are cluttered, generic, and charge high service fees. They lack premium styling and don't provide a focused, exclusive booking environment. EventSphere solves this by providing a clean, aesthetic, and distraction-free portal designed specifically for premium, curated, or invite-only events."),
        
        ("2. Who is the target audience for this platform?",
         "<b>Organizers:</b> Luxury brands, art galleries, fashion houses, wellness centers, and corporate event planners looking for a premium listing portal.<br/><b>Attendees:</b> Discerning guests who value high-end curations and want a smooth, aesthetic booking experience."),
        
        ("3. How does this website make event discovery easier for a user?",
         "It groups events into high-end 'Curation Categories' (like <i>Galas &amp; Soirées</i>, <i>Art &amp; Exhibitions</i>, <i>Haute Couture</i>). Users can filter events instantly by typing a keyword, city, or date, avoiding overwhelming lists of irrelevant events."),
        
        ("4. What are the key features currently working on the platform?",
         "Account creation, secure login, and email OTP dispatch simulation; searching and filtering events by title, tag, category, and city; creating events with banner and gallery uploads (with local disk fallback); booking tickets and generating unique, secure invitation passcodes; and attendee dashboard showing active entry passes, wishlist items, and account settings."),
        
        ("5. What features are currently under construction or simulated?",
         "<b>Real Payment Gateway:</b> Ticket checkout is currently simulated using a complimentary pass-generation checkout flow.<br/><b>Camera QR Scanner:</b> The check-in validation currently relies on typing the passcode text rather than scanning via a mobile camera."),
        
        ("6. When and how will you integrate a payment gateway?",
         "We plan to integrate <b>Stripe API</b> or <b>Razorpay SDK</b> in the next phase. The backend will generate a secure payment token, redirect the user to a secure payment page, and use a webhook to automatically issue the ticket pass code once payment succeeds."),
        
        ("7. How does an organizer manage bookings and guest check-ins?",
         "Organizers have a dedicated dashboard showing a list of their created events. By clicking on an event, they can view the guest list, verify individual invitation codes, and toggle the guest's check-in status."),
        
        ("8. What is the 'Wishlist' feature, and how does it benefit the user?",
         "The Wishlist lets users bookmark events they are interested in without committing to booking a ticket. It allows them to curate their upcoming experiences and easily purchase passes later."),
        
        ("9. How does this site make things easier for mobile users?",
         "The layout is built using mobile-first CSS grid systems. Pages, forms, navigation bars, and buttons adapt dynamically to fit mobile viewports, allowing users to browse events and present check-in codes at doors on their phones."),
        
        ("10. Can an attendee cancel or refund a booking?",
         "Currently, attendees can view their active passes in their dashboard. Toggling cancellations or initiating automatic refunds is planned for the payment integration phase."),
        
        ("11. How are invitation codes shared with attendees?",
         "Upon successful checkout, a unique alphanumeric invitation passcode is generated and displayed on their dashboard. It is also simulated as being dispatched to their registered email for convenience."),
        
        ("12. What happens if an event sells out?",
         "The system tracks the capacity limit (<code>capacity</code>) of each event. When the number of booked tickets reaches the capacity limit, the frontend replaces the 'Book Ticket' button with a 'Sold Out' badge, preventing overselling."),
        
        ("13. How does this platform differ from standard sites like Eventbrite?",
         "EventSphere focuses on high-end design aesthetics (using a luxury cream, gold, and dark charcoal theme), offers a cleaner interface, and includes customized organizer features like private invitation code tracking."),
        
        ("14. What value does EventSphere bring to a luxury brand organizer?",
         "It protects the brand's premium image. Listing an elite fashion show or art exhibit on a cluttered ticketing site dilutes its prestige; EventSphere provides a curated environment that aligns with luxury branding."),
        
        ("15. What are your monetization models? How can this project generate revenue?",
         "<b>Commission per Ticket:</b> Taking a small fee (e.g., 2-3%) on paid tickets.<br/><b>Featured Event Placements:</b> Charging organizers to feature their event banner on the homepage.<br/><b>Custom Branding Add-ons:</b> Charging for custom email invites or custom RSVP forms."),
        
        ("16. What is the purpose of the 'Curation Categories'?",
         "To maintain a premium theme. Instead of standard categories like 'seminars' or 'business workshops', EventSphere uses curated themes like <i>Haute Couture</i>, <i>Wellness Retreats</i>, and <i>Classical Concerts</i>."),
        
        ("17. How secure is a user's personal information on this site?",
         "Passwords are encrypted before database storage, communication is encrypted using HTTPS protocols, and JWT tokens are used to authorize account access."),
        
        ("18. Can an organizer set up a free or complimentary event?",
         "Yes. If the organizer sets the ticket price to <code>0</code>, the checkout system automatically bypasses any payment simulations and issues a complimentary pass instantly."),
        
        ("19. How does the site handle different user roles (Attendee vs. Organizer)?",
         "On signup, users select their role. Attendees get a dashboard focused on tickets and wishlists. Organizers get a dashboard for listing events, uploading media, and tracking check-ins."),
        
        ("20. What are the planned future enhancements for this project?",
         "Implementing real Stripe payment checkouts; adding a camera-based QR code reader for door entry check-ins; integrating calendar exports (Google Calendar, iCal) for booked passes; and adding real-time email triggers via Brevo/Sendinblue.")
    ]

    for q, a in q_a_user:
        story.append(Paragraph(f"<b>Q: {q}</b>", h2_style))
        story.append(Paragraph(f"<b>A:</b> {a}", body_style))
        story.append(Spacer(1, 4))

    story.append(PageBreak())

    # --- PART 2: TECHNICAL POV ---
    story.append(Paragraph("Part 2: Technical &amp; Teacher Point of View", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#C5A880"), spaceAfter=15))

    q_a_tech = [
        ("1. What is the full technology stack of this application?",
         "We use the standard <b>MERN</b> stack:<br/>• <b>M</b>ongoDB: NoSQL database.<br/>• <b>E</b>xpress.js: Minimalist web server framework.<br/>• <b>R</b>eact.js (built with Vite): Component-based frontend.<br/>• <b>N</b>ode.js: JavaScript runtime environment."),
        
        ("2. Why did you choose Vite over Create React App (CRA)?",
         "Vite utilizes native ES modules, leading to near-instantaneous startup times and extremely fast Hot Module Replacement (HMR) during development. Production bundling is optimized using Rolldown/Esbuild, yielding smaller asset chunks than CRA's Webpack configuration."),
        
        ("3. Why MongoDB instead of a relational database like MySQL or PostgreSQL?",
         "<b>Dynamic Schema:</b> Events contain variable attributes (e.g., coordinates, optional gallery image arrays, varying tag structures). Storing this in MongoDB avoids rigid tables and complex joins.<br/><b>Developer Velocity:</b> MongoDB stores data as JSON-like documents, which map directly to JavaScript objects, eliminating the need for object-relational mapping (ORM) translations."),
        
        ("4. Explain your database schema design and relationships.",
         "We use <b>Mongoose</b> to define schemas:<br/>• <b>User:</b> Holds login credentials, role, and bio details.<br/>• <b>Event:</b> Refers to <code>organizer</code> (User <code>ObjectId</code> reference) and holds details like category, images, capacity, and city.<br/>• <b>Ticket:</b> Links a <code>user</code> reference to an <code>event</code> reference and holds the unique <code>inviteCode</code> passcode.<br/>• <b>Category:</b> Stores lookup items for categorizing events."),
        
        ("5. How do you handle password encryption?",
         "We use <b>bcryptjs</b>. During registration (and profile password updates), the plain-text password is mixed with a random string (salt) with 10 rounds and hashed. The plain-text password is never saved or logged."),
        
        ("6. Explain your authentication flow.",
         "We use <b>JSON Web Tokens (JWT)</b>:<br/>1. The user logs in, and the server generates a token containing their user ID signed with a server-side secret.<br/>2. The frontend stores this token in LocalStorage and attaches it as a Bearer token in the <code>Authorization</code> header of subsequent API requests.<br/>3. A backend <code>protect</code> middleware decodes the token to verify the user's identity."),
        
        ("7. How does the role authorization middleware work?",
         "We built an <code>authorize(...roles)</code> middleware that checks the authenticated user's role: if their role is not included in the allowed list, it returns a <code>403 Forbidden</code> status code, protecting admin/organizer routes from unauthorized access."),
        
        ("8. How did you design the media upload storage architecture?",
         "We created a hybrid system using <b>Multer</b> and <b>Cloudinary</b>:<br/>1. Multer parses multipart form data and saves the file temporarily in a local <code>Backend/uploads</code> folder.<br/>2. If Cloudinary credentials exist in <code>.env</code>, the script uploads the local file to Cloudinary and deletes the temp file.<br/>3. If credentials are missing, it falls back to serving the file locally via Express static routing."),
        
        ("9. What is the 'Automatic Fallback Mode' in the server, and why did you build it?",
         "In local development, database connection issues (like IP whitelisting errors on MongoDB Atlas) can crash the server. We built an in-memory database fallback using a mock database class. If the Atlas connection fails, the server automatically starts in mock mode, saving data in memory so testing is uninterrupted."),
        
        ("10. How is client-side state managed in React?",
         "We use <b>Redux Toolkit</b> (slices for <code>auth</code> and <code>events</code>). Redux manages global states like current login status, user object, and fetched event lists, which prevents prop-drilling across layouts."),
        
        ("11. How do you handle API calls between the frontend and backend?",
         "We use an <b>Axios instance</b> (<code>Frontend/src/services/api.js</code>). It is configured with a base URL matching our backend server and includes an interceptor that automatically attaches the JWT token to the <code>Authorization</code> header if it exists."),
        
        ("12. How does the search and filter query work at the database level?",
         "The backend extracts query parameters (<code>search</code>, <code>category</code>, <code>city</code>, <code>priceMax</code>) from the URL. It builds a dynamic Mongoose query object using regex match: <code>title: { $regex: search, $options: 'i' }</code> and comparison operators: <code>price: { $lte: priceMax }</code>."),
        
        ("13. How did you handle Cross-Origin Resource Sharing (CORS)?",
         "We integrated the <code>cors</code> middleware in Express. It is configured to allow requests from specific origins (like the local frontend port or the deployed Render static site) and permits headers like <code>Authorization</code> and <code>Content-Type</code>."),
        
        ("14. What are React Router 'Protected Routes'?",
         "It is a wrapper component (<code>ProtectedRoute.jsx</code>) that checks if the user is authenticated in the Redux store. If the user is logged in, it renders the dashboard page. If not, it redirects them to <code>/login</code> using the React Router <code>&lt;Navigate&gt;</code> component."),
        
        ("15. How do you prevent database queries from blocking the Express event loop?",
         "All database queries are asynchronous. We use modern <code>async/await</code> syntax with Mongoose operations, which offloads the query operations to Node's background thread pool, allowing Express to continue processing incoming HTTP requests."),
        
        ("16. What is the purpose of `package-lock.json`?",
         "It locks the exact versions of all nested dependencies installed in the <code>node_modules</code> folder. This ensures that the application builds identically across all developers' machines and production servers, preventing breaking changes from auto-updated packages."),
        
        ("17. How do you validate form input values on the server?",
         "We use HTML5 native validations on the frontend, and Mongoose schema-level validations (e.g. <code>required: true</code> properties and email format validation match expressions) on the backend to prevent corrupted records."),
        
        ("18. Explain how static files are served in the application.",
         "In the backend, we use Express's built-in static middleware: <code>app.use('/uploads', express.static(path.join(__dirname, 'uploads')))</code>. This tells Express that any HTTP requests targeting `/uploads` should be mapped directly to the files stored in the local server directory."),
        
        ("19. How did you resolve the build errors when deploying to Render?",
         "We resolved build errors by ensuring that: we ran production builds locally using Vite to catch syntax and import errors; all dependencies were declared in <code>package.json</code>; and no absolute system filepaths were referenced in the codebase, using relative path resolutions instead."),
        
        ("20. How would you optimize the performance of EventSphere in a production environment?",
         "<b>Code Splitting:</b> Using React <code>lazy()</code> and <code>Suspense</code> to load dashboard routes only when visited.<br/><b>Image Compression:</b> Resizing user uploads on the client side before sending them to the server.<br/><b>Database Indexing:</b> Adding indexes to fields like <code>city</code> and <code>category</code> in MongoDB to speed up query filtering.")
    ]

    for q, a in q_a_tech:
        story.append(Paragraph(f"<b>Q: {q}</b>", h2_style))
        story.append(Paragraph(f"<b>A:</b> {a}", body_style))
        story.append(Spacer(1, 4))

    doc.build(story, canvasmaker=NumberedCanvas)
    print("PDF successfully generated!")

if __name__ == "__main__":
    build_pdf()
