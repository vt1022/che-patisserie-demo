import React, { useContext } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Context } from '../context/index';
import { formatString } from '../../utils/formatString';

const Flavours = ({ className = '', h2 = '', weeklyFlavours, allFlavours }) => {
    const [{ flavours }, dispatch] = useContext(Context);
    const flavourImage = (flavourName) =>
        flavours.all.find((item) => item['Flavour'] === flavourName)['Image'];

    if (weeklyFlavours && weeklyFlavours.length > 0) {
        const dateArr = weeklyFlavours[0]
            ? weeklyFlavours[0]['Date'].split('/')
            : '00/00/00';

        return (
            <div className={`flavours--${className} flavours`}>
                {(h2 = !'' && <h2 className='flavours__h2'>{h2}</h2>)}
                <p className='flavours__p'>
                    *Delivery on{' '}
                    {moment(dateArr, 'MM/DD/YYYY').format('MMM Do')}
                </p>
                <div className='flavours__grid'>
                    {weeklyFlavours.map((flavour, i) => {
                        return (
                            <Link
                                key={i}
                                className='flavours__grid-item'
                                to={`/flavours/${formatString(
                                    flavour['Flavour'],
                                    'kebab'
                                )}`}
                                onClick={() =>
                                    dispatch({
                                        type: 'selectedFlavour',
                                        data: flavour['Flavour'],
                                    })
                                }
                            >
                                <img
                                    className='flavours__grid-item__image'
                                    src={flavourImage(flavour['Flavour'])}
                                    alt={`${flavour['Flavour']} macaron`}
                                />
                                <h3 className='flavours__grid-item__name'>
                                    {flavour['Flavour']}
                                </h3>
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    } else if (allFlavours) {
        return (
            <div className={`flavours--${className} flavours flavours--all`}>
                {(h2 = !'' && <h2 className='flavours__h2'>{h2}</h2>)}
                <div className='flavours__grid'>
                    {allFlavours.map((flavour, i) => {
                        return (
                            <Link
                                key={i}
                                className={`flavours__grid-item`}
                                to={`/flavours/${formatString(
                                    flavour['Flavour'],
                                    'kebab'
                                )}`}
                                onClick={() =>
                                    dispatch({
                                        type: 'selectedFlavour',
                                        data: flavour['Flavour'],
                                    })
                                }
                            >
                                <img
                                    className='flavours__grid-item__image'
                                    src={flavourImage(flavour['Flavour'])}
                                    alt={`${flavour['Flavour']} macaron`}
                                />
                                <h3 className='flavours__grid-item__name'>
                                    {flavour['Flavour']}
                                </h3>
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    } else {
        return null;
    }
};

export default Flavours;
