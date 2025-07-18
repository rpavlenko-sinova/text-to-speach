import { type PlasmoCSConfig } from 'plasmo';
import PERMISSIONS_URL from 'url:~/src/permissions.html';

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>'],
};

export const getInlineAnchor = () => document.body;

const Content = () => {
  return (
    <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 10000 }}>
      <iframe
        src={PERMISSIONS_URL}
        allow="microphone"
        style={{
          width: '1px',
          height: '1px',
          border: 'none',
          opacity: 0,
          position: 'absolute',
        }}
        onLoad={() => {
          console.log('Permissions iframe loaded');
        }}
      />
    </div>
  );
};

export default Content;
