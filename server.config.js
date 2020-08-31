import path from 'path';
export default {
  plugins: [
    '@uvue/server/plugins/gzip',
    // Server error page
    [
      '@uvue/server/plugins/serverError',
      {
        path: path.join(__dirname, 'src', 'server', 'error.html'),
      },
    ],
    '@uvue/server/plugins/static',
    '@uvue/server/plugins/modernBuild',
    [
      '@uvue/server/plugins/cookie',
      {
        secret: 'kiwsan'
      }
    ]
  ]
}