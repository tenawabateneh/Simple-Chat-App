Tips for making dockerize and How it works/runs


# take base image which is node version 11

# setup a directory to keep all of code and execute code from thier
 
 #keep all code under this app folder

# coppy ths package.json on to this docker image in current location which is /app

# installing the dependency for this application to excecute

# the above npm command is the part of the base image which is node:11 specified on the first line and
# then take the package.json file and read the required dependancy and install them

# take up the code which is server and others from local current dir to this specifed base docker image
# taking everything from local in current dir and keeping it under WORKDIR

# make avilable the required port which is on the code (5000)

# start the primary applicaton 

Basics for building and running docker image
# after all go to cmd and run the following command
# docker build -t tenaw .
# docker run -d --name tenawcontainer -p 8000:80 tenaw
# docker run -d -p 8000:80 tenaw
# docker run -p 8000:80 -d tenaw    8000-is for host and 80-is for docker container(port redirected)


#Then you can get your app by typing localhost:5000 on URL


============================================================================================================================================
============================================================================================================================================
################                 Steps to add/Integrate with Jenkins                                            ############################
============================================================================================================================================
============================================================================================================================================

NB: permission denied while trying to connect to the Docker daemon socket
Fix:
  Stop and remove current Jenkins container:
    docker stop jenkins
    docker rm jenkins
  Run Jenkins again with Docker socket mounted:
    docker run -d --name jenkins -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock jenkins/jenkins:lts
  
  Then enter container:
    docker exec -u 0 -it jenkins bash
  Install docker client again:
    apt update
    apt install docker.io -y
  Then give Jenkins permission:
    chmod 666 /var/run/docker.sock
  Exit:exit
  Now rerun pipeline using: ----   Build Now   ---- Docker build stage should work successfully.


  
============================================================================================================================================
============================================================================================================================================
################                 Steps Kubernetes Deployment with Jenkins                                            ############################
============================================================================================================================================
============================================================================================================================================
Create:
  deployment.yaml         ....Apply manually first:   kubectl apply -f deployment.yaml
✅ STEP 1 — Install kubectl inside Jenkins container 
  docker exec -it -u root jenkins bash
  apt update
  apt install kubectl -y

Install Node.js + npm inside Jenkins container.
✅ STEP 1 — Enter Jenkins container as root
  docker exec -it -u root jenkins bash

✅ STEP 2 — Install Node.js + npm

Inside container run:
  apt update
  apt install -y nodejs npm

✅ STEP 3 — Verify installation
  node -v
  npm -v

✅ STEP 4 — Exit container
  exit

✅ STEP 5 — Restart Jenkins
  docker restart jenkins

✅ STEP 6 — Run pipeline again
Now this stage should work:
  Install Dependencies
