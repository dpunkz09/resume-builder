module.exports = {
  apps: [
    {
      name: 'jpaworx-resume-builder',
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