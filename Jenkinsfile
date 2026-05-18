pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                echo 'Cloning repository...'
                git 'https://github.com/tenawabateneh/Simple-Chat-App.git'
            }
        }
        stage('Build') {
            steps {
                echo 'Building...'
                sh 'docker build -t mycoolchat .'
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