@echo off
echo 🚀 Deploying Firestore Rules...
pushd config
call firebase deploy --only firestore:rules
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Deployment failed! Make sure you are logged in to Firebase.
) else (
    echo ✅ Rules deployed successfully!
)
popd
pause
