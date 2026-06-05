
// // Jenkinsfile for CI/CD pipeline of Simple Chat App form local to Kubernetes manually triggered

// pipeline {
//     agent any

//     environment {
//         // Define any environment variables here
//         ImageName = 'tenaw/simple-chat-app'
//     }   

//     stages {
//         stage('Clone Repository') {
//             steps {
//                 echo 'Cloning repository...'
//                 git 'https://github.com/tenawabateneh/Simple-Chat-App.git'
//             }
//         }
//         stage('Install Dependencies') {
//             steps {
//                 echo 'Installing dependencies...'
//                 sh 'npm install'
//             }
//         }
//         stage('Test') {
//             steps {
//                 echo 'Testing...'
//                 sh 'npm test'
//             }
//         }
//         stage('Docker Build') {
//             steps {
//                 echo 'Building...'
//                 sh 'docker build -t $ImageName .'
//             }
//         }
//         stage('Docker Push') {
//             steps {
//               withCredentials([usernamePassword(
//                 credentialsId: 'dockerhub', 
//                 usernameVariable: 'USER', 
//                 passwordVariable: 'PASS'
//                 )]) {
//                     sh 'echo $PASS | docker login -u $USER --password-stdin'
//                     echo 'Pushing Docker image...'
//                     sh "docker push $ImageName"
//                 }
//             }
//         }
//         stage('Kubernetes Deployment') {
//             steps {
//                 echo 'Deploying to Kubernetes...'
//                 sh 'kubectl apply -f deployment.yaml --insecure-skip-tls-verify=true'
//             }
//         }
//         stage('Deploy') {
//             steps {
//                 echo 'Restarting Kubernetes deployment to pull the latest image...'
//                 sh 'kubectl rollout restart deployment/simple-chat-app --insecure-skip-tls-verify=true'
//                 sh 'kubectl rollout status deployment/simple-chat-app --timeout=90s --insecure-skip-tls-verify=true'
//                 sh 'kubectl get svc simple-chat-service --insecure-skip-tls-verify=true'
//             }
//         }
//     }
// }



// Jenkinsfile for CI/CD pipeline of Simple Chat App using Poll SCM
pipeline {
    agent any

    triggers {
        pollSCM('*/2 * * * *') // Poll GitHub every 2 minutes for changes
    }

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
        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing...'
                sh 'npm test'
            }
        }
        stage('Docker Build') {
            steps {
                echo 'Building...'
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
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                    echo 'Pushing Docker image...'
                    sh "docker push $ImageName"
                }
            }
        }
        stage('Kubernetes Deployment') {
            steps {
                echo 'Deploying to Kubernetes...'
                sh 'kubectl apply -f deployment.yaml --insecure-skip-tls-verify=true'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Restarting Kubernetes deployment to pull the latest image...'
                sh 'kubectl rollout restart deployment/simple-chat-app --insecure-skip-tls-verify=true'
                sh 'kubectl rollout status deployment/simple-chat-app --timeout=90s --insecure-skip-tls-verify=true'
                sh 'kubectl get svc simple-chat-service --insecure-skip-tls-verify=true'
            }
        }
    }
}





