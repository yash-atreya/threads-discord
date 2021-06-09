const urlBuilder = require('build-url');
const request = require('request-promise');

exports.parseThreads = async (threads = []) => {
  let reply = '';

  for (let i = 0; i < threads.length; i++) {
    const text = threads[i].full_text ? threads[i].full_text : threads[i].full_text;
    const mediaEntities =
      threads[i].extended_tweet && threads[i].extended_tweet.entities.media && threads[i].extended_tweet.entities.media.length
        ? threads[i].extended_tweet.entities.media
        : threads[i].entities.media && threads[i].entities.media.length
        ? threads[i].entities.media
        : null;
    let extended_entities;
    if (
      (threads[i].hasOwnProperty('extended_entities') && threads[i].extended_entities.hasOwnProperty('media')) ||
      (threads[i].extended_tweet && threads[i].extended_tweet.extended_entities && threads[i].extended_tweet.extended_entities.media)
    ) {
      extended_entities =
        threads[i].extended_tweet && threads[i].extended_tweet.extended_entities.media && threads[i].extended_tweet.extended_entities.media.length
          ? threads[i].extended_tweet.extended_entities.media
          : threads[i].extended_entities.media && threads[i].extended_entities.media.length
          ? threads[i].extended_entities.media
          : null;
    }
    const {cleanThread} = cleaningThread(text, extended_entities, mediaEntities, threads[i].quoted_status_permalink);
    const link = await generateLink(threads[i]);

    const string = '\n' + `A thread by ${threads[i].user.name}\n` + cleanThread + '\n' + 'Read more here: ' + link + '\n\n/***************/\n';
    reply = reply.concat(string);
  }

  return reply;
};

const generateLink = async (baseTweet) => {
  const id = baseTweet.id_str;
  const description = baseTweet.full_text ? baseTweet.full_text : baseTweet.text;
  const title = `A thread by ${baseTweet.user.name}`;
  const image =
    'https://firebasestorage.googleapis.com/v0/b/threads-1511.appspot.com/o/Twitter_Reply_Banner.png?alt=media&token=091bbab3-ee9b-4e76-8929-068af757415f';

  const options = {
    method: 'POST',
    uri: `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${process.env.FIREBASE_API_KEY}`,
    body: {
      longDynamicLink: url(title, description, image, id, 'threads'),
      suffix: {
        option: 'SHORT',
      },
    },
    json: true,
  };

  try {
    const body = await request(options);
    return body.shortLink;
  } catch (e) {
    throw new Error('ErrorGeneratingLink: ', e);
  }
};

function url(title, description, image, id, type) {
  return urlBuilder('https://threadsapp.page.link', {
    queryParams: {
      link: `https://threads-1511.web.app/${type}/${id}`,
      apn: 'com.threadsapp',
      ibi: 'com.threads',
      ipbi: 'com.threads',
      isi: '1512677811',
      st: title,
      sd: description,
      si: image,
    },
  });
}

function cleaningThread(str, extended_entities, mediaEntities, quoted_status_permalink) {
  if (
    (extended_entities !== null &&
      extended_entities !== undefined &&
      mediaEntities !== null &&
      (extended_entities.length === 1 || extended_entities.length === 2 || extended_entities.length === 3 || extended_entities.length === 4) &&
      extended_entities[0].type === 'photo') ||
    (extended_entities !== null &&
      extended_entities !== undefined &&
      mediaEntities !== null &&
      extended_entities.length === 1 &&
      extended_entities[0].type === 'video') ||
    (extended_entities !== null &&
      extended_entities !== undefined &&
      mediaEntities !== null &&
      extended_entities.length === 1 &&
      extended_entities[0].type === 'animated_gif')
  ) {
    let cleanThread = str
      .replace(/https:\/\/t.co\/\w{1,10}$/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
    if (quoted_status_permalink && quoted_status_permalink.url) {
      cleanThread = cleanThread.replace(quoted_status_permalink.url, '');
    }
    const urlList = cleanThread.match(/https:\/\/t.co\/\w{1,10}/m);
    return { cleanThread, urlList };
    // console.log(regexedThread);
  } else {
    // setRegexedThread(full_text);
    let cleanThread = str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    if (quoted_status_permalink && quoted_status_permalink.url) {
      cleanThread = cleanThread.replace(quoted_status_permalink.url, '');
    }
    const urlList = cleanThread.match(/https:\/\/t.co\/\w{1,10}/gm);
    return { cleanThread, urlList };
  }
  // console.log(regexedThread);
}

exports.isNumeric = (str) => {
    try {
       const num = Number(str);
       return Number.isInteger(num);
    } catch(e) {
        return false;
    }
  }
