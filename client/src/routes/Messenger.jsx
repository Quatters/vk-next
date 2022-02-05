import { React } from 'react';
import { Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import '../static/css/messenger.css';
import { LinkContainer } from 'react-router-bootstrap';

function Messenger() {
  return (
    <Col>
      <div className='messenger'>
        <Col className='users col-xl-3 col-md-4 hide-on-sm'>
          <div className='search'>
            <input type='text' placeholder='Search...' />
          </div>
          <div className='user-wrapper active'>
            <div className='user-thumbnail'></div>
            <div className='user-info-wrapper'>
              <div className='user'>Бот вопрос/ответ</div>
              <div className='last-message'>Нет.</div>
            </div>
          </div>
          <div className='user-wrapper'>
            <div className='user-thumbnail'></div>
            <div className='user-info-wrapper'>
              <div className='user'>Вы</div>
              <div className='last-message'></div>
            </div>
          </div>
        </Col>
        <Col className='chat'>
          <div className='status-bar'>
            <FontAwesomeIcon
              icon={faArrowLeft}
              className='text-primary show-on-sm'
              // onClick={handleShow}
              style={{ cursor: 'pointer', marginRight: '20px' }}
            />
            <LinkContainer to={'/users'}>
              <div className='user'>Человек человекович</div>
            </LinkContainer>
          </div>
          <div className='messages-wrapper'>
            <div className='message-wrapper'>
              <div className='message'>
                <div className='message-body'>
                  Привет! Здесь вы можете задать вопрос, на который я отвечу
                  "Да" или
                  "Нет".WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWw
                </div>
              </div>
            </div>

            <div className='message-wrapper justify-content-end'>
              <div className='message'>
                <div className='message-body'>?</div>
              </div>
            </div>

            <div className='message-wrapper'>
              <div className='message'>
                <div className='message-body'>Нет.</div>
              </div>
            </div>
          </div>
          <div className='input-wrapper'>
            <textarea
              name='send-message'
              placeholder='Напишите сообщение...'
              className='autoresizable'
              style={{ height: '37px', overflowY: 'hidden' }}
            ></textarea>
            <div className='send-button d-flex align-self-end ms-3'>
              <FontAwesomeIcon
                icon={faPaperPlane}
                className='text-primary'
                size='lg'
              />
            </div>
          </div>
        </Col>
      </div>
    </Col>
  );
}

export default Messenger;
