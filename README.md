# GeoPetCare

Create a completely new, professional, responsive website for GeoPetCare Foundation from scratch.



Website:

GeoPetCare Foundation

www.GeoPetCare.org

“Every Life Matters. Every Paw Deserves Love.”



Use the GeoPetCare logo as the main branding reference and build the entire website using colours that match the logo. Keep the design clean, trustworthy, modern and focused on animal welfare.



IMPORTANT: DO NOT ADD ANY FAKE, SAMPLE, DUMMY OR INVENTED DATA.



1. LOGIN



When someone opens the website, show a login page first.



Show two options:



USER LOGIN



- Login with Google/Gmail using secure Google OAuth.

- After login, enter the normal user website.

- Store the user's name, Gmail, profile image and user ID.

- Users can see only their own profile and submissions.



ADMIN LOGIN



- Only one Admin account initially.

- Admin email: "vkswtrust@gmail.com"

- Admin password: "Vikasram88@#"

- Store the password securely as a hash.

- NEVER expose the password in frontend code.

- Do not allow Admin registration.

- No other user can become Admin.

- Protect all Admin routes and APIs with server-side authentication and role-based access control.



2. USER WEBSITE



After login, show the complete GeoPetCare Foundation website with:



- Home

- Our Vision

- Our Mission

- Our Promise

- Rescue

- Emergency Medical Care

- Community Feeding

- Sterilization Programme

- GeoPet ID™

- Adopt. Don't Shop.

- Foster Programme

- Animal Ambulance

- Volunteer With Us

- Corporate CSR

- Sponsor A Life

- Schools & Colleges

- Paws of India™

- Our Roadmap

- Transparency

- Contact / Enquiry



Use the following main message:



One World. One Family. Every Pet Counts.



3. ADMIN DASHBOARD



Create a secure "/admin" dashboard available ONLY to the Admin.



Dashboard sections:



- Overview

- Users

- Enquiries

- Volunteer Applications

- CSR Enquiries

- Adoption Enquiries

- Donations

- Donation Details

- Adoption Animals

- Impact Statistics

- Settings

- Logout



4. USERS



Admin can see real users who logged into the website:



- Name

- Gmail

- Profile image

- User ID

- Registration/login information



Never show passwords.



Users must never see other users' information.



5. ENQUIRIES



All forms submitted by users must be saved in the database and visible only to Admin.



Separate them into:



- General Enquiries

- Volunteer Applications

- Foster Applications

- Adoption Enquiries

- CSR Enquiries

- Sponsorship Enquiries

- Contact Enquiries



Include name, email, phone where applicable, message, user ID, date/time and status.



Admin can view, search, filter and update enquiry status.



6. VOLUNTEER



Create a Volunteer With Us form with options such as:



- Animal Rescuer

- Foster Parent

- Feeding Volunteer

- Event Volunteer

- Veterinary Volunteer

- Student Volunteer

- CSR Volunteer



Submitted forms must appear in the Admin Dashboard.



7. CSR



Create a Corporate CSR enquiry form.



Collect:



- Organisation/company name

- Contact person

- Email

- Phone

- CSR interest

- Message



Show submissions only to Admin.



8. DONATIONS



Create a professional Sponsor A Life section with:



₹500 — Feed a rescued animal

₹2,500 — Vaccinate and treat one rescued animal

₹5,000 — Sponsor one month of rehabilitation

₹10,000 — Sponsor sterilization and complete medical care

₹25,000 — Sponsor a community feeding zone

₹50,000 — Sponsor a GeoPet Rescue Vehicle for one day

₹1,00,000 — Become a GeoPetCare City Welfare Partner



These are suggested contribution amounts only. Do not claim that any amount has actually been received unless there is a real donation record.



Create Admin → Donation Details.



Admin can add/edit:

- Payment QR image attached above

Account in the name of : Vasudhaiva Kutumbakam Social welfare Trust

Bank : Bank of Maharashtra,

Address : Vadavalli, Coimbatore

Account no : No  60483459738

IFSC code : MAHB0002529



When Admin saves the information, the latest information automatically appears on the user donation page.



Initially keep all bank/payment fields empty.



DO NOT invent any bank details, UPI ID, QR code, phone number or account information.



9. ADOPTION



Only Admin can add animals available for adoption.



Admin can:



- Add animal

- Upload photos

- Edit animal

- Delete animal

- Mark Available

- Mark Adopted

- Mark Fostered



Animal information:



- Name

- Species

- Age

- Gender

- Location

- Rescue story

- Health status

- Vaccination status

- Sterilization status

- Behaviour

- Description

- GeoPet ID™



Only animals actually added by Admin should appear on the user website.



If there are no animals, show:



“No animals are currently listed for adoption. Please check back soon.”



Do NOT create fake/sample animals.



Users can click Interested in Adoption and submit an enquiry. The enquiry goes to Admin.



10. IMPACT STATISTICS



Do NOT add fake statistics.



Never automatically display things like:



“500+ Animals Rescued”

“1,000+ Animals Fed”

“250+ Adoptions”

“50+ Volunteers”



unless those numbers are real.



Create Admin → Impact Statistics.



Admin can enter real information such as:



- Animals Rescued

- Animals Treated

- Animals Fed

- Animals Vaccinated

- Animals Sterilized

- Animals Adopted

- Animals Fostered

- Volunteers

- Feeding Locations

- Cities Covered

- Other impact statistics



If Admin has not entered a number, hide the statistic or show:



“Data will be updated soon.”



Where possible, calculate statistics automatically from real database records.



11. NO FAKE DATA — STRICT RULE



This rule applies to the entire website.



NEVER invent:



- Dogs or cats

- Adoption records

- User accounts

- Donations

- Donation totals

- Rescue numbers

- Feeding numbers

- Medical numbers

- Volunteer counts

- Phone numbers

- Email addresses

- Bank details

- UPI details

- Emergency numbers

- Addresses

- Achievements

- Impact statistics

- Organisational claims



If the Admin has not entered the information, do not display it as real.



IF THE ADMIN DID NOT ENTER IT, DO NOT CLAIM IT.



12. GEO PET ID™



Include the GeoPet ID™ concept.



Where Admin enters information, an animal can have:



- Unique QR Identity

- Medical Record

- Vaccination History

- Rescue History

- Adoption Status

- Sponsor Information

- Recovery Timeline



Do not expose private information publicly unless Admin marks it as public.



13. SECURITY



Use a proper backend/database and secure authentication.



Implement:



- Google OAuth

- Secure Admin authentication

- Password hashing

- Role-based access control

- Protected Admin routes

- Protected APIs

- Database security policies

- User-specific data access

- Secure image uploads

- Form validation

- Logout



Users must never access Admin data or another user's information.



14. DESIGN



Make the website:



- Professional

- Modern

- Trustworthy

- Responsive

- Mobile-friendly

- Easy to navigate

- Consistent with the GeoPetCare logo



Use the logo's colour palette throughout the website.



Do not make the website look like a generic template.



Build the database, authentication, user interface and Admin Dashboard as part of this fresh project.



Finally, test:



- User login

- Admin login

- Admin access protection

- User profiles

- All enquiry forms

- Adoption management

- Donation details

- QR upload

- Impact statistics

- Database permissions

- Mobile responsiveness

- Logout



Most importantly, never use fake data anywhere on the website.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://geofoundation.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0ac6e7e1-829e-495a-b492-8d5ac24dbf73).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
