import ZongJi from 'zongji'

let watcher = new ZongJi({

 });

// Each change to the replication log results in an event
zongji.on('binlog', function(evt) {
  evt.dump();
});

// Binlog must be started, optionally pass in filters
zongji.start({
  includeEvents: ['tablemap', 'writerows', 'updaterows', 'deleterows']
});