# Resource Links

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
https://app.quickdatabasediagrams.com/#/


QuickDBD database schema
========================

User
-
UserID PK int
Email string
Password string

BoardUsers
-
BoardID FK >- Boards.BoardID 
UserID FK >- User.UserID

Boards
-
BoardID PK int
BoardName string
FilterItem int FK >- Filters.FilterID
Locations int FK >- Location.LocationID

Filters
-
FilterID PK int
FilterName string

Location
-
LocationID PK int
LocationName string
LocationNotes string
YelpID int
GooglePlaceID int
