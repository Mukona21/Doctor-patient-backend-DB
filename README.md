# DocSeek---Backend
## Fetch URL: https://docseek-db.up.railway.app/

### Postman Collection JSON (API testing purpose) : https://github.com/AhindraD/DocSeek---Backend---MongoDB/blob/master/DocSeek.postman_collection.json

### Postman Screen-Shots : 
![all requests](https://github.com/AhindraD/DocSeek---Backend---MongoDB/blob/master/snaps/postman-snap.PNG?raw=true)
<br>

# Endpoints

- Auth
  - `POST /auth/doctor/signup`  
  - `POST /auth/doctor/login`  
  - `POST /auth/patient/signup`
  - `POST /auth/patient/login`
  - `POST /auth/token`
  
- APPOINTMENT
  - `POST /appoint/new`: 
  
  - `POST /appoint/complete/:appointID`: 

  - `POST /appoint/review/:appointID`: 

  - `POST /appoint/cancel/:appointID`: 
  
  - `GET /appoint/patient/:patientID`: 

  - `GET /appoint/doctor/:doctorID`: 
  

- DOCTOR
  - `POST /doctor/onboard`: 

  - `GET /doctor/all`: 
  - `GET /doctor/:docID`: 
  - `GET /doctor/name/:name`: 
  - `GET /doctor/city/:city`: 
  - `GET /doctor/speciality/:speciality`: 

- PATIENT
  - `POST /patient/onboard`: 

  <br>
  <br>
  <br>

## Tech Stack and Notes
- React
- ExpressJS
- MongoDB
- Postman for API testing.
