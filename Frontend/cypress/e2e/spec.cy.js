describe('EventSphere - Main Pages Normal Use Cases', () => {
  const liveUrl = 'https://eventsphere-prestige.onrender.com';

  beforeEach(() => {
    // Visit home page before each test
    cy.visit(liveUrl);
  });

  it('Should load the homepage and check signature elements', () => {
    // Check if brand logo and CTA button are visible
    cy.contains('EVENTSPHERE').should('be.visible');
    cy.contains('Explore Events').should('be.visible');

    // Scroll to and verify that the footer exists
    cy.get('footer').scrollIntoView().should('be.visible');
    cy.contains('©').should('exist');
  });

  it('Should successfully browse the About Us page', () => {
    // Navigate to About page
    cy.contains('About').click();
    cy.url().should('include', '/about');

    // Verify main introductory headings are present
    cy.contains('Our Philosophy').should('be.visible');
    cy.contains('The Sphere').should('be.visible');
  });

  it('Should fill out and submit the Contact support form', () => {
    // Navigate to Contact page
    cy.contains('Contact').click();
    cy.url().should('include', '/contact');

    // Fill in name (the first text input)
    cy.get('input[type="text"]').type('John Doe');
    
    // Fill in email (the email input)
    cy.get('input[type="email"]').type('john.doe@example.com');
    
    // Fill in details message (the textarea)
    cy.get('textarea').type('Hello, I would like to inquire about event reservation capacities.');

    // Submit the message
    cy.contains('button', 'Send Inquiry').click();

    // Verify the correct toast notification message
    cy.contains('Thank you. Our luxury concierge desk will respond to your inquiry shortly.').should('be.visible');
  });

  it('Should search for an event on the Events Explorer page', () => {
    // Navigate to Events page
    cy.contains('Events').click();
    cy.url().should('include', '/events');
    
    // Type in search filter
    cy.get('input[placeholder="Search by title, keyword, or artist..."]').type('Gala');
  });

  it('Should successfully navigate between tabs in the User Dashboard', () => {
    // 1. Visit Login page
    cy.visit(`${liveUrl}/login`);
    
    // 2. Fill in pre-seeded Guest account details
    cy.get('input[type="email"]').type('user@eventsphere.com');
    cy.get('input[type="password"]').type('password123');
    
    // 3. Submit
    cy.contains('button', 'Sign In').click();
    cy.url().should('include', '/dashboard');

    // 4. Navigate to "My Tickets" tab
    cy.contains('My Tickets').click();
    cy.url().should('include', '/dashboard/tickets');
    cy.contains('Active Invitation Codes').should('be.visible');

    // 5. Navigate to "Wishlist" tab
    cy.contains('Wishlist').click();
    cy.url().should('include', '/dashboard/wishlist');

    // 6. Navigate to "Settings" tab
    cy.contains('Settings').click();
    cy.url().should('include', '/dashboard/settings');
    cy.contains('Profile Settings').should('be.visible');
  });

});