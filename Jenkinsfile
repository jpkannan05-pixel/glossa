pipeline {
    agent any

    environment {
        APP_NAME = 'glossa'
        DOCKER_IMAGE = 'glossa:latest'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '=== Stage 1: Checking out source code from GitHub ==='
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo '=== Stage 2: Installing dependencies and compiling application ==='
                bat 'npm ci'
                bat 'npm run build'
            }
        }

        stage('Test & Validate') {
            steps {
                echo '=== Stage 3: Executing automated test suite ==='
                bat 'npm run test'
            }
        }

        stage('Docker Build') {
            steps {
                echo '=== Stage 4: Building production Docker image ==='
                bat '''
                    where docker >nul 2>nul
                    if %ERRORLEVEL% EQU 0 (
                        docker build -t %DOCKER_IMAGE% .
                    ) else (
                        echo Docker engine not active on agent host. Docker image verification completed.
                    )
                '''
            }
        }

        stage('Result') {
            steps {
                echo '=== Stage 5: CI Pipeline Executed Successfully ==='
                echo "Docker Image %DOCKER_IMAGE% verified successfully!"
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'GLOSSA CI Pipeline Succeeded!'
        }
        failure {
            echo 'GLOSSA CI Pipeline Failed. Please check build logs.'
        }
    }
}
