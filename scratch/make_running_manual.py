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
            self.draw_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#2C2623")) # Charcoal
        
        # Header (Only on pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 755, "EVENTSPHERE — RUNNING MANUAL")
            self.setStrokeColor(colors.HexColor("#C5A880")) # Gold line
            self.setLineWidth(0.5)
            self.line(54, 747, 558, 747)
        
        # Footer (On all pages)
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#6E635D")) # Muted Taupe
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 40, page_text)
        self.drawString(54, 40, "EventSphere Portal • Premium Curation & Ticketing")
        self.restoreState()

def build_pdf():
    pdf_path = r"c:\Users\Yash Bhatt\Desktop\Demo\Running Manual of EventSphere.pdf"
    
    # margins: 0.75 inch (54pt)
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=72,
        bottomMargin=72
    )

    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'MainTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=28,
        leading=34,
        textColor=colors.HexColor("#2C2623"),
        alignment=0,
        spaceAfter=15
    )
    
    section_title_style = ParagraphStyle(
        'SectionTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor("#2C2623"),
        spaceBefore=15,
        spaceAfter=10,
        keepWithNext=True
    )
    
    step_title_style = ParagraphStyle(
        'StepTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor("#C5A880"), # Gold
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'BodyText_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor("#2C2623"),
        spaceAfter=8
    )

    bullet_style = ParagraphStyle(
        'BulletText_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor("#2C2623"),
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=6
    )

    story = []

    # --- PAGE 1 ---
    story.append(Paragraph("EventSphere", title_style))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#C5A880"), spaceAfter=15))
    
    story.append(Paragraph("<b>System Requirements:</b>", section_title_style))
    story.append(Paragraph("• Internet Connection", bullet_style))
    story.append(Paragraph("• Modern Web Browser (Google Chrome, Microsoft Edge, Firefox, Safari)", bullet_style))
    story.append(Paragraph("• Node.js (v18 or higher) and npm installed locally", bullet_style))
    
    story.append(Spacer(1, 10))
    story.append(Paragraph("<b>1. Local Setup &amp; Installation:</b>", section_title_style))
    story.append(Paragraph("Follow these instructions to run EventSphere locally on your computer:", body_style))
    
    story.append(Paragraph("<b>Option A: Installing via Git Clone:</b>", step_title_style))
    story.append(Paragraph("1. Open your terminal/command prompt and clone the repository:<br/>&nbsp;&nbsp;&nbsp;&nbsp;<code>git clone https://github.com/BhumikaSharma3112/EventSphere.git</code>", bullet_style))
    story.append(Paragraph("2. Navigate into the cloned directory:<br/>&nbsp;&nbsp;&nbsp;&nbsp;<code>cd EventSphere</code>", bullet_style))
    
    story.append(Paragraph("<b>Option B: Installing via ZIP File:</b>", step_title_style))
    story.append(Paragraph("1. Download and extract the project ZIP archive using your native system extractor, WinRAR, or 7-Zip.", bullet_style))
    story.append(Paragraph("2. Open terminal/command prompt and navigate into the extracted root folder:<br/>&nbsp;&nbsp;&nbsp;&nbsp;<code>cd EventSphere</code> (or your specific extracted folder name).", bullet_style))
    
    story.append(Paragraph("<b>Installing Dependencies &amp; Configuration (For Both Options):</b>", step_title_style))
    story.append(Paragraph("1. <b>Install Frontend Dependencies:</b> Navigate to the Frontend folder and install:<br/>&nbsp;&nbsp;&nbsp;&nbsp;<code>cd Frontend</code><br/>&nbsp;&nbsp;&nbsp;&nbsp;<code>npm install</code>", bullet_style))
    story.append(Paragraph("2. <b>Install Backend Dependencies:</b> Navigate to the Backend folder and install:<br/>&nbsp;&nbsp;&nbsp;&nbsp;<code>cd ../Backend</code><br/>&nbsp;&nbsp;&nbsp;&nbsp;<code>npm install</code>", bullet_style))
    story.append(Paragraph("3. <b>Configure Environment Settings:</b> Create a file named <code>.env</code> inside the <code>Backend</code> folder. Add parameters like <code>PORT=5000</code> and <code>JWT_SECRET=your_jwt_secret_key</code>. (Leave the MongoDB connection URI blank to automatically trigger the database local mock fallback configuration for quick offline testing).", bullet_style))
    
    story.append(PageBreak())

    # --- PAGE 2 ---
    story.append(Paragraph("<b>2. Starting The Application:</b>", section_title_style))
    story.append(Paragraph("1. <b>Launch the Backend Server:</b> Navigate to the <code>Backend</code> folder and run:<br/>&nbsp;&nbsp;&nbsp;&nbsp;<code>npm run dev</code> (runs backend on port 5000).", bullet_style))
    story.append(Paragraph("2. <b>Launch the Frontend Server:</b> Open a new terminal window, navigate to the <code>Frontend</code> folder, and run:<br/>&nbsp;&nbsp;&nbsp;&nbsp;<code>npm run dev</code> (runs frontend on port 5173).", bullet_style))
    story.append(Paragraph("3. <b>Visit the App:</b> Open your browser to <b>http://localhost:5173</b>.", bullet_style))
    story.append(Paragraph("4. <b>Or visit the live deployed website:</b> <b>https://eventsphere-prestige.onrender.com/</b>.<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;o <b>NOTE:</b> If using the live Render link, the first database request may take <b>30–60 seconds</b> to load if the free tier hosting is sleeping.", bullet_style))
    
    story.append(Spacer(1, 10))
    story.append(Paragraph("<b>3. How to Use:</b>", section_title_style))
    
    story.append(Paragraph("Step 1: Browse Events", step_title_style))
    story.append(Paragraph("Open the website to view the luxury curations registry.", body_style))
    
    story.append(Paragraph("Step 2: Sign In / Access Roles", step_title_style))
    story.append(Paragraph("Click <b>Sign In</b> on the top right. Register a new account or log in with credentials. Select either the <b>Attendee</b> (guest) or <b>Organizer</b> (curator) role.", body_style))
    
    story.append(Paragraph("Step 3: Book Ticket (Attendee)", step_title_style))
    story.append(Paragraph("Browse listed events, click on an event card, choose your ticket quantity, and reserve your admission pass.", body_style))
    
    story.append(Paragraph("Step 4: View &amp; Download Ticket (Attendee)", step_title_style))
    story.append(Paragraph("Navigate to <b>My Tickets</b> to view your active passes, scannable QR codes, and download invitation passes as premium PDFs.", body_style))
    
    story.append(Paragraph("Step 5: Curate Event (Organizer)", step_title_style))
    story.append(Paragraph("Go to the Organizer dashboard. Click <b>Curate Event</b> to list a brand-new curation, specify capacity limits, ticket pricing, and upload banner/gallery images.", body_style))
    
    story.append(Paragraph("Step 6: QR Scan &amp; Attendee Check-In (Organizer)", step_title_style))
    story.append(Paragraph("On the Organizer panel, navigate to the <b>Attendees Registry</b> for your curated event. Click <b>'Simulate Camera Scan'</b> to automatically scan pending guest check-in QR codes, check them in with live timestamps, and trigger confetti.", body_style))
    
    story.append(PageBreak())

    # --- PAGE 3 ---
    story.append(Paragraph("<b>4. Expected Output:</b>", section_title_style))
    story.append(Paragraph("After successful bookings and actions, the application displays:", body_style))
    story.append(Paragraph("• Scannable QR Codes generated uniquely for each invitation pass.", bullet_style))
    story.append(Paragraph("• Clean, professional PDF files containing booking codes, event location, and entry guidelines.", bullet_style))
    story.append(Paragraph("• Dynamic analytics graphs on Admin/Organizer dashboards depicting total sales (₹) and ticket distribution.", bullet_style))
    
    story.append(Spacer(1, 10))
    story.append(Paragraph("<b>5. Error Handling:</b>", section_title_style))
    story.append(Paragraph("If incorrect or incomplete information is entered:", body_style))
    story.append(Paragraph("• <b>Validation Alerts:</b> Mandatory fields like phone number are strictly checked (10 digits for Indian number selectors).", bullet_style))
    story.append(Paragraph("• <b>Price &amp; Capacity Clamps:</b> Admission price cannot exceed ₹10,00,000, and capacity is locked up to 100,000 to prevent layout breakage.", bullet_style))
    story.append(Paragraph("• If the database connection drops, the backend automatically falls back to an in-memory database configuration so that local testing continues uninterrupted.", bullet_style))
    
    story.append(Spacer(1, 10))
    story.append(Paragraph("<b>6. Closing the Application:</b>", section_title_style))
    story.append(Paragraph("• Click <b>Sign Out</b> from the top-right profile menu to safely close your session.", body_style))
    story.append(Paragraph("• Simply close the browser tab. User credentials are stored securely in local storage and HTTP cookies.", body_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print("Running Manual of EventSphere PDF successfully generated!")

if __name__ == "__main__":
    build_pdf()
