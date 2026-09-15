-- 0008_media_no_size_limit.sql
-- Remove the 5 MB per-file cap on the "media" bucket. The app downsizes large
-- images in the browser before upload and again on the server, so the bucket
-- limit only got in the way. Safe to run more than once.

update storage.buckets
set file_size_limit = null
where id = 'media';
