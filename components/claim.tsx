import { FC } from "react";
import styles from './index.module.scss';
import { Modal, Button } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons';
import LogoSVG from './logo-svg'

type Props = {
  isShowModal: boolean
  handleClaimCancelModal: () => void
  handleClaimConfirmModal: () => void
};

const Claim: FC<Props> = ({ isShowModal, handleClaimConfirmModal, handleClaimCancelModal }) => {
  return (
    <Modal
      title=""
      style={{ top: 20 }}
      visible={isShowModal}
      onCancel={handleClaimCancelModal}
      footer={null}
      centered
      width={'50%'}
      closeIcon={<CloseCircleOutlined style={{ fontSize: '20px', color: '#fff' }} />}
    >
      <div className={styles.modalContentLogo}>
        <LogoSVG width={1280} height={920} />
      </div>
      <p className={styles.claimText}>Claim reward for ad xxx.</p>
      <p className={styles.claimText}>Reward amount: xxx</p>
      <p className={styles.claimText}>Estimated transaction fee: xxx</p>
      <Button shape="round" type="primary" onClick={handleClaimConfirmModal} style={{marginTop: 20}}>Submit</Button>
    </Modal>
  )
}

export default Claim;

