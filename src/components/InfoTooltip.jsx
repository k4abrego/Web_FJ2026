import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

function InfoTooltip({ text }) {
    return (
        <span className="info-tooltip-wrapper">
            <InfoOutlinedIcon className="info-tooltip-icon" />
            <span className="info-tooltip-box">{text}</span>
        </span>
    )
}

export default InfoTooltip
