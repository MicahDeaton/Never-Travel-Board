# Resource Links

Requirements
============
Project requirements
https://docs.google.com/presentation/d/1yIYYYI9UAmr8LE8owcGIGKo6Rdx6t1MsXoqp4vgwZ3s/edit#slide=id.gcf9fa50de2_0_2287

Wireframe
=========

Product Requirement Doc (example)
https://app.eraser.io/workspace/b8W3UBwaZwfLWzeAo2nD?origin=

Wireframe
https://app.eraser.io/workspace/nr7FTYY0He28ZEiO5kUC?origin=


APIs
====

TripAdvisor API
https://tripadvisor-content-api.readme.io/reference/getlocationdetails

Getting Started with the Yelp Fusion API
https://docs.developer.yelp.com/docs/fusion-intro


Database Diagram Tool
=====================

Quick Database Diagrams (QuickDBD) is a simple online tool to quickly draw database diagrams by typing.

https://www.quickdatabasediagrams.com/  ->  Go to Try The App


QuickDBD database schema
========================
Use QuickDBD to render the EER diagram
https://app.quickdatabasediagrams.com/#/

Userstoboards
-
user_id PK FK >- User.id
board_board_id PK FK >- Boards.board_id

Boards
-
board_id PK int
board_name string
board_description string

Filters
-
board_id PK FK >- Boards.board_id
filter_name PK string

Locations
-
board_id FK >- Boards.board_id
location_id PK int
location_order int
location_name string
location_imageurl string
location_notes string
location_duration time
tripadvisor_placeid string
google_placeid string
latitude float
longitude float

User
-
id PK int
name string
email string
password string
