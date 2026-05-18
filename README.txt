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
# docker run -d --name tenawcontainer -p 8090:80 tenaw
# docker run -d -p 8080:80 tenaw
# docker run -p 8000:80 -d tenaw    8000-is for host and 80-is for docker container(port redirected)


#Then you can get your app by typing localhost:5000 on URL