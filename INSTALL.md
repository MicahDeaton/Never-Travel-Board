# Installation notes

1. Download / Clone the repository to a local directory
   $ git clone https://github.com/MicahDeaton/Never-Travel-Board.git

   or (for ssh):
   $ git clone git@github.com:MicahDeaton/Never-Travel-Board.git

2. Install node, and install npm module dependencies

   $ npm install

3. Set up mysql database
   $ mysql -u root -p
     Enter password: <your mysql password>

   In the mysql command line interface, create the database
   mysql> source db/schema.sql

4. Populate the database with seed data
   $ node seeds/seed.js

5. Run the application
   $ nodemon server.js

6. Browse to the application
   ie. https://localhost:3001/

