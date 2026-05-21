pipeline {
    agent any

    environment {
        ImageName = 'tenaw/simple-chat-app'
    }

    stages {

        stage('Clone Repository') {
            steps {
                echo 'Cloning repository...'
                git 'https://github.com/tenawabateneh/Simple-Chat-App.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                // sh 'npm install'
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Docker image...'
                sh 'docker build -t $ImageName .'
            }
        }

        stage('Docker Push') {
            steps {

                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {

                    sh '''
                        docker logout || true

                        export DOCKER_CLIENT_TIMEOUT=300
                        export COMPOSE_HTTP_TIMEOUT=300

                        echo "$PASS" | docker login -u "$USER" --password-stdin

                        docker push tenaw/simple-chat-app
                    '''
                }
            }
        }

        stage('Test') {
            steps {
                echo 'Testing...'
                // Add test commands here
            }
        }

        stage('Kubernetes Deployment') {
            steps {
                echo 'Deploying to Kubernetes...'
                sh 'kubectl apply -f deployment.yaml'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deployment completed successfully.'
            }
        }
    }
}