pipeline {
    agent any

    environment {
        // Define any environment variables here
        ImageName = 'tenaw/simple-chat-app'
    }   

    stages {
        stage('Clone Repository') {
            steps {
                echo 'Cloning repository...'
                git 'https://github.com/tenawabateneh/Simple-Chat-App.git'
            }
        }
        stage('Docker Build') {
            steps {
                echo 'Building...'
                sh 'docker build -t simple-chat-app .'
            }
        }
        stage('Docker Push') {
            steps {
              withCredentials([usernamePassword(
                credentialsId: 'dockerhub', 
                usernameVariable: 'USER', 
                passwordVariable: 'PASS'
                )]) {
                    sh "echo $PASS | docker login -u $USER --password-stdin"  
                    echo 'Pushing Docker image...'
                    sh "docker push $ImageName"
                }
            }
        }
        stage('Test') {
            steps {
                echo 'Testing...'
                // Add test commands here
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying...'
                // Add deployment commands here
            }
        }
    }
}