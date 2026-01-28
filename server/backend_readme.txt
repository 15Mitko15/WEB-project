WARNING! The backend currently doesnt have any error handling. Proceed with caution!

Starting the backend:

-open cmd and navigate to the home directory of the index.php
-start the php server with: php -S localhost:3000 index.php

The backend operates with receiving (empty) sql-s and responds with sql.
The backend works by routing certain requests.
Invalid requests will give missing page message.

VALID ADRESSES for interaction with the backend (very suitable for use with Postman): <<<<<-----

- http://localhpst:3000/login
-		       /logout
-		       /register
-		       /check_logged_in
-		       /home
-		       /event_preference

(those /\ can be found in index.php (declarations) as well as in src/handlers/router_handler.php (definitions))

INTERACTION WITH THE BACKEND: <<<<<-----<<<<<-----<<<<<-----<<<<<-----<<<<<-----<<<<<-----<<<<<-----<<<<<-----

Getting any result different than what is written here means that something went wrong.
Be sure to propperly set up your .env in the directory where you have your "server" folder!
Be sure to start the database before using the backend!

-login:
	-frontend sends sql: {"email":"sample@ema.il", "password": "samplePassw0rd"}
	-backend sends respond that can be ignored (THIS RESPOND IS SUBJECT TO CHANGE)
	-backend sends "already logged in" respond if the user us logged in

-logout:
	-frontend sends EMPTY post
	-backend does NOT respond

-register:
	-frontend sends sql: {"name": "sample name", "email": "sample@ema.il", "password": "samplePassw0rd"}
	-backend does NOT send respond (SUBJECT TO CHANGE)
	-backend sends "already logged in" respond if the user us logged in

-check_logged_in:
	-frontend sends EMPTY post
	-backend responds with the user id if the user is logged in
	-backend (should) responds with "not logged in" type of message of the user is not logged in

-home:
	-frontend sends EMPTY post
	-backend sends sql containing array with arrays, each of witch contains information for and event in the said manner:
		{
			"id"=> event id,
			"daytime"=> daytime of event,
			"title"=> title of event,
			"presenter_fn"=> fn of presenter of the event,
			"presenter_first_name"=> first name of presenter,
			"presenter_last_name"=> last name of the presenter,
			"hall"=> hall number of the event,
			"faculty"=> faculty of the vent,
			"user_interest"=> the logged in user interest
		}

-event_preference:
	-fronend send sql: {"event_id": "id_number_of_the_event", "new_interest_id": "id_number_of_the_interest"}
	-backend does NOT send respond (SUBJECT TO CHANGE)
	-WARNING: "event_id" should be of a valid event
		  "new_interest_id" should be a hole number
		  if "new_interest_id" is a positive number it should be of a valid interst from the "intersts" table in the database
		  if "new_interest_id" is 0 or negative it will remove the interest entry from the "attendings" table (if such exists)