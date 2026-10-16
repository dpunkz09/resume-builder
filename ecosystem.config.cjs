module.exports = {
  apps: [
    {
      name: 'resume-builder',
      cwd: '/var/www/jpaworx.com/resume-builder',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 8167
      }
    }
  ]
};